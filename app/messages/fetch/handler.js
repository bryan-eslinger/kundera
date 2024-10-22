import { CLUSTER_METADATA_LOGFILE } from "../../config/logs.js";
import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import { metaDataRecordTypeKeys, readLog } from "../../storage/log.js";
import FetchResponse from "./schema.js";

const fetchHandler = (req, res) => {
    res.headers(headerVersions.V1);
    
    // NOTE for now this assumes all valid topics are empty
    // but we still need to read the logs to determine if a
    // topic is valid

    readLog(CLUSTER_METADATA_LOGFILE).then(records => {
        const validTopicIds = new Set(records
            .filter(record => record.recordType === metaDataRecordTypeKeys.PARTITION)
            .map(partitionRecord => partitionRecord.recordValue.topicId)
        )

        res.send(new FetchResponse({
            throttleTimeMs: 0, // TODO take value from actual server behavior
            errorCode: errorCodes.NO_ERROR,
            sessionId: req.body.sessionId,
            // NOTE: this should really pull from req.body.topics
            // but it looks like the test request is coming in with
            // topics empty and this field populated instead
            responses: req.body.forgottenTopicsData.map(topic => ({
                topicId: topic.topicId,
                partitions: topic.partitions.map(partition => ({
                    partitionIndex: partition,
                    // TODO actually look at the topic records
                    errorCode: validTopicIds.has(topic.topicId) ? errorCodes.NO_ERROR : errorCodes.UNKNOWN_TOPIC,
                    highWatermark: 0,
                    lastStableOffset: 0,
                    logStartOffset: 0,
                    abortedTransactions: [],
                    preferredReadReplica: 0,
                    records: []
                }))
            }))
        }));
    })

}

export default fetchHandler;
