import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import { readLogs } from "../../storage/log.js";
import FetchResponse from "./schema.js";

const fetchHandler = (req, res) => {
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
            partitions: topic.partitions.map(partition => {
                const logs = readLogs(topic.topicId, partition);
                return {
                    partitionIndex: partition,
                    // NOTE: at least for now, UnknownTopicError is the only error
                    errorCode: !!logs.err ? errorCodes.UNKNOWN_TOPIC : errorCodes.NO_ERROR,
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
                    records: logs.records
                }
            })
        }))
    }));
}

export default fetchHandler;
