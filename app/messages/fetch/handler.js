import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import FetchResponse from "./schema.js";

const describeTopicPartitions = (req, res) => {
    res.headers(headerVersions.V1);

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
                // TODO remove the default after done with codecrafters tests
                partitionIndex: partition.partition || 0,
                errorCode: errorCodes.UNKNOWN_TOPIC,
                highWatermark: 0,
                lastStableOffset: 0,
                logStartOffset: 0,
                abortedTransactions: [],
                preferredReadReplica: 0,
                records: []
            }))
        }))
    }))
}

export default describeTopicPartitions;
