import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import FetchResponse from "./schema.js";
import broker from "../../index.js"

const fetchHandler = async (req, res) => {
    res.headers(headerVersions.V1);

    const responses = await Promise.all(req.body.topics.map(async (topic) => {
        const topicName = broker.metadata.getTopicName(topic.topicId);
        if (!topicName) {
            return {
                topicId: topic.topicId,
                partitions: topic.partitions.map(partition => ({
                    partitionIndex: partition,
                    // TODO error mapping / handling from the logcontroller
                    errorCode: errorCodes.UNKNOWN_TOPIC_OR_PARTITION, // TODO this vs UNKNOWN_TOPIC?
                    highWatermark: 0,
                    lastStableOffset: 0,
                    logStartOffset: 0,
                    abortedTransactions: [],
                    preferredReadReplica: 0,
                    records: null
                }))
            }
        }
        return {
            topicId: topic.topicId,
            partitions: await Promise.all(topic.partitions.map(async (partition) => {
                const { batches, err } = await broker.logController.readBatches(
                    broker.metadata.topicIdMap[topic.topicId], 
                    partition.partition,
                    partition.fetchOffset
                );
                return {
                    partitionIndex: partition.partition,
                    // TODO error mapping / handling from the logcontroller
                    errorCode: !!err ? errorCodes.UNKNOWN_SERVER_ERROR : errorCodes.NO_ERROR,
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
                    // TODO this concat is necessary because readBatches services both cases where
                    //the caller wants to consume the batches in some way in the broker and 
                    // (i.e. here) where we just want to pass the bytes along. needs to be separate
                    //handling somehow in the logcontroller (e.g. param to readbatches or different
                    // methods) so we can avoid the buffer concat here
                    records: Buffer.concat(batches)
                }
            }))
        }
    }));

    res.send(new FetchResponse({
        throttleTimeMs: 0, // TODO take value from actual server behavior
        errorCode: errorCodes.NO_ERROR,
        sessionId: req.body.sessionId,
        responses
    }));
}

export default fetchHandler;
