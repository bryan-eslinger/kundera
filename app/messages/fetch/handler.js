import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import FetchResponse from "./schema.js";
import broker from "../../index.js"

const fetchHandler = (req, res) => {
    res.headers(headerVersions.V1);

    res.send(new FetchResponse({
        throttleTimeMs: 0, // TODO take value from actual server behavior
        errorCode: errorCodes.NO_ERROR,
        sessionId: req.body.sessionId,
        responses: req.body.topics.map(topic => {
            const topicName = broker.metadata.getTopicName(topic.topicId);
            if (!topicName) {
                return {
                    partitionIndex: partition,
                    // TODO error mapping / handling from the logcontroller
                    errorCode: errorCodes.UNKNOWN_TOPIC,
                    highWatermark: 0,
                    lastStableOffset: 0,
                    logStartOffset: 0,
                    abortedTransactions: [],
                    preferredReadReplica: 0,
                    records: []
                }
            }
            return {
                topicId: topic.topicId,
                partitions: topic.partitions.map(partition => {
                    const logs = broker.logController.read(topic.topicId, partition);
                    return {
                        partitionIndex: partition,
                        // TODO error mapping / handling from the logcontroller
                        errorCode: !!logs.err ? errorCodes.UNKNOWN_SERVER_ERROR : errorCodes.NO_ERROR,
                        // TODO read from logs
                        highWatermark: 0,
                        // TODO read from logs
                        lastStableOffset: 0,
                        // TODO read from logs
                        logStartOffset: 0,
                        // TODO read from logs
                        abortedTransactions: [],
                        // TODO read from logs
                        preferredReadReplica: 0,
                        records: logs.data
                    }
                })
            }
        })
    }));
}

export default fetchHandler;
