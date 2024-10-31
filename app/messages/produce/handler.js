import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import ProduceResponse from "./schema.js";
import broker from "../../index.js";
import RecordBatch from "../../protocol/fields/record_batch.js";

const produceHandler = async (req, res) => {
    res.headers(headerVersions.V1);

    // TODO transaction handling
    // TODO acks handling
    // TODO timeout handling

    const responses = await Promise.all(req.body.topicData.map(async (topic) => ({
        name: topic.name,
        partitionResponses: await Promise.all(topic.partitionData.map(async (partition) => {
            // TODO error handling
            if (broker.metadata.topicExists(topic.name)) {
                const batch = new RecordBatch(partition.records);
                // TODO check partition exists
                await broker.logController.write(topic.name, partition.index, batch);
                return {
                    index: partition.index,
                    errorCode: errorCodes.NO_ERROR,
                    baseOffset: 0,
                    logAppendTimeMs: 0,
                    logStartOffset: 0, // TODO implement
                    recordErrors: []
                };
            } else {
                return {
                    index: partition.index,
                    errorCode: errorCodes.UNKNOWN_TOPIC_OR_PARTITION,
                    baseOffset: 0,
                    logAppendTimeMs: 0,
                    logStartOffset: 0,
                    recordErrors: []
                };
            }
        }))
    })));

    res.send(new ProduceResponse({
        responses,
        throttleTimeMs: 0 // TODO implement (broker-wide)
    }));
}

export default produceHandler;
