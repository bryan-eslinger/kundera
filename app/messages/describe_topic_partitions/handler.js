import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import DescribeTopicPartitionsBody from "./schema.js";
import { metaDataRecordTypeKeys } from "../../metadata/index.js";
import broker from "../../index.js";

const describeTopicPartitions = (req, res) => {
    res.headers(headerVersions.V1);
    
    const topicRecords = {};
    const partitionRecords = {};

    // TODO move this into the metadata data structure somewhere?
    for (let record of broker.metadata.records) {
        switch(record.recordType) {
            case metaDataRecordTypeKeys.TOPIC_RECORD:
                topicRecords[record.recordValue.name] = record;
                partitionRecords[record.recordValue.topicId] = [];
                break;
            case metaDataRecordTypeKeys.PARTITION:
                partitionRecords[record.recordValue.topicId].push(record);
                break;
        }
    }
        
    res.send(new DescribeTopicPartitionsBody({
        throttleTimeMs: 0,
        topics: req.body.topics.map((topic) => {
            const topicRecord = topicRecords[topic.name];
            if (!topicRecord) {
                return {
                    errorCode: errorCodes.UNKNOWN_TOPIC_OR_PARTITION,
                    name: topic.name,
                    topicId: '00000000-0000-0000-0000-000000000000',
                    isInternal: false,
                    partitions: [],
                    topicAuthorizedOperations: 0
                }
            }

            return {
                errorCode: errorCodes.NO_ERROR,
                name: topic.name,
                topicId: topicRecord.recordValue.topicId,
                isInternal: false,
                partitions: partitionRecords[topicRecord.recordValue.topicId]
                    .sort((a, b) => a.recordValue.partitionId - b.recordValue.partitionId)
                    .map(record => ({
                        errorCode: errorCodes.NO_ERROR,
                        partitionIndex: record.recordValue.partitionId,
                        leaderId: record.recordValue.leader,
                        leaderEpoch: record.recordValue.leaderEpoch,
                        replicaNodes: record.recordValue.replicas,
                        isrNodes: record.recordValue.isr,
                        eligibleLeaderReplicas: record.recordValue.eligibleLeaderReplicas,
                        lastKnownElr: record.recordValue.lastKnownElr,
                        offlineReplicas: [], // TODO get the actual values
                    })),
                topicAuthorizedOperations: 0, // TODO get the actual values,
            }
        }),
        // TODO pagination?
    }));
}

export default describeTopicPartitions;
