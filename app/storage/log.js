import { readFileSync } from "node:fs";
import VarIntField from "../protocol/types/var_int.js"
import TopicRecord from "../metadata/topic_record.js";
import FeatureLevelRecord from "../metadata/feature_level.js";
import PartitionRecord from "../metadata/partition.js";
import { CLUSTER_METADATA_LOGFILE, LOG_DIR } from "../config/logs.js";

// TODO look into zero-copy optimizations with Node and make sure the
// fetch responses are being zero-copied

// TODO this stuff probably wants to be more specific to metadata logs
// this log module probably wants to handle more about replication?

export const metaDataRecordTypeKeys = {
    ABORT_TRANSACTION: 25,
    ACCESS_CONTROL_ENTRY: 18,
    BEGIN_TRANSACTION: 23,
    BROKER_REGISTRATION_CHANGE: 17,
    CLIENT_QUOTA: 14,
    CONFIG: 4,
    DELEGATION_TOKEN: 10,
    END_TRANSACTION: 24,
    FEATURE_LEVEL: 12,
    FENCE_BROKER: 7,
    NOOP: 20,
    PARTITION_CHANGE: 5,
    PARTITION: 3,
    PRODUCER_IDS: 15,
    REGISTER_BROKER: 0,
    REGISTER_CONTROLLER: 27,
    REMOVE_ACCESS_CONTROL_ENTRY: 19,
    REMOVE_DELEGATION_TOKEN: 26,
    REMOVE_TOPIC: 9,
    REMOVE_USER_SCRAM_CREDENTIAL: 22,
    TOPIC_RECORD: 2,
    UNFENCE_BROKER_RECORD: 8,
    UNREGISTER_BROKER: 1,
    USER_SCRAM_CREDENTIAL: 11,
    ZK_MIGRATION: 21
}

const metaDataRecordTypes = {
    [metaDataRecordTypeKeys.FEATURE_LEVEL]: FeatureLevelRecord,
    [metaDataRecordTypeKeys.PARTITION]: PartitionRecord,
    [metaDataRecordTypeKeys.TOPIC_RECORD]: TopicRecord,
}

export class UnknownTopicError extends Error {
    constructor(topicName) {
        super(`UnknownTopic: ${topicName}`);
    }
}

// TODO: take advantage of readFile async version to be able to
// parallelize calls to readLogs
export const readLogs = (topicId, partition) => {
    console.debug(`reading logs for ${topicId}`)
    const topicName = getTopicName(topicId);

    if (!topicName) {
        return { err: new UnknownTopicError(), records: null };
    }

    // TODO read latest log file; this assumes only one per partition with no rolling
    const records = readLog(`${LOG_DIR}/${getTopicName(topicId)}-${partition}/00000000000000000000.log`, false)
    // TODO introduce a deserializeRecordValue flag to readLog/readBatch/readRecord, set to false
    // int this call and return the actual recordValue byte array
    return { err: null, records };
}

// TODO better caching
let TOPIC_NAMES = null;
const getTopicName = (topicId) => {
    console.debug(`resolving topic name for ${topicId}`);
    if (TOPIC_NAMES === null) {
        const records = readLog(CLUSTER_METADATA_LOGFILE);
        TOPIC_NAMES = Object.fromEntries(
            records
                .filter(record => record.recordType === metaDataRecordTypeKeys.TOPIC_RECORD)
                .map(topicRecord => [topicRecord.recordValue.topicId, topicRecord.recordValue.name])
        );
    }

    return TOPIC_NAMES[topicId]
}

export const readLog = (logFile, deserializeRecords = true) => {
    console.debug(`reading ${logFile}`);
    // TODO error handling
    const data = readFileSync(logFile);

    if (!deserializeRecords) { return data }
    
    const records = [];
    let offset = 0;
    while (offset < data.length) {
        // TODO handle malformed logs?
        offset += 8; // base offset
        
        const batchLength = data.readInt32BE(offset);
        offset += 4;
        
        records.push(readBatch(
            data.subarray(offset, offset + batchLength), 
            deserializeRecords
        ));
        offset += batchLength;
    }
    return records.flat();
}

const readBatch = (data) => {
    const records = [];

    // TODO actual parser for when we actually need this stuff
    const recordsLengthStart = (
        4 + // partition leader epoch
        1 + // magic byte
        4 + // crc
        2 + // attributes
        4 + // last offset delta
        8 + // base timestamp 
        8 + // max timestamp
        8 + // producer id
        2 + // producer epoch
        4 // base sequence
    );
    const recordsLength = data.readInt32BE(recordsLengthStart);
    // TODO error handling (not enough bytes/records)
    let offset = 4 + recordsLengthStart;
    for (let i = 1; i <= recordsLength; i++) {
        const { value: recordLength, size: recordLengthSize } = VarIntField.deserialize(data, offset);
        const start = offset + recordLengthSize;
        records.push(readRecord(data.subarray(start, start + recordLength)));
        offset += recordLengthSize + recordLength;
    }
    return records;
}

// TODO schema for records --> first understand the different types of logs and whether
// this applies to metadata logs specifically or more generally
const readRecord = (data) => {
    const record = {};
    
    record.attributes = data.readInt8();
    let offset = 1

    const timestampDelta = VarIntField.deserialize(data, offset);
    record.timestampDelta = timestampDelta.value;
    offset += timestampDelta.size;

    const offsetDelta = VarIntField.deserialize(data, offset);
    record.offsetDelta = offsetDelta.value;
    offset += offsetDelta.size;

    const keyLength = VarIntField.deserialize(data, offset);
    record.keyLength = keyLength.value;
    offset += keyLength.size;
    if (keyLength.value > 0) {
        offset += keyLength.value;
    }
    // TODO parse the key when present

    const valueLength = VarIntField.deserialize(data, offset);
    record.valueLength = valueLength.value;
    offset += valueLength.size;

    record.frameVersion = data.readInt8(offset++);

    record.recordType = data.readInt8(offset++);
    
    record.version = data.readInt8(offset++);
    
    record.recordValue = metaDataRecordTypes[record.recordType]
        .deserialize(data, offset)
        .value

    return record;
}
