import TopicRecord from "./records/topic_record.js";
import FeatureLevelRecord from "./records/feature_level.js";
import PartitionRecord from "./records/partition.js";

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
    TOPIC: 2,
    UNFENCE_BROKER: 8,
    UNREGISTER_BROKER: 1,
    USER_SCRAM_CREDENTIAL: 11,
    ZK_MIGRATION: 21
}

export const metaDataRecordTypes = {
    [metaDataRecordTypeKeys.FEATURE_LEVEL]: FeatureLevelRecord,
    [metaDataRecordTypeKeys.PARTITION]: PartitionRecord,
    [metaDataRecordTypeKeys.TOPIC]: TopicRecord,
}

export default class Metadata {
    // TODO think through the data structures here more carefully
    knownTopics = new Set();
    topicIdMap = {};
    #records = [];
    #topicOffsets = {};

    get records() {
        return this.#records;
    }

    set records(records) {
        this.#records = records;
        records
            .filter(record => record.value.recordType === metaDataRecordTypeKeys.TOPIC)
            .forEach(topicRecord => {
                const topicName = topicRecord.value.recordValue.name;
                this.knownTopics.add(topicName);
                this.topicIdMap[topicRecord.value.recordValue.topicId] = topicName
            })
    }

    set topicOffsets(topicOffsets) {
        this.#topicOffsets = topicOffsets
    }

    getTopicName(topicId) {
        return this.topicIdMap[topicId]
    }

    incrementOffset(topic) {
        this.#topicOffsets[topic]++;
    }

    nextOffset(topic) {
        return this.#topicOffsets[topic] + 1n;
    }

    topicExists(topicName) {
        return this.knownTopics.has(topicName);
    }
}
