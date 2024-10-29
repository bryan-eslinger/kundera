import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import ProduceResponse from "./schema.js";
import broker from "../../index.js";
import RecordBatch from "../../protocol/fields/record_batch.js";

const produceHandler = (req, res) => {
    res.headers(headerVersions.V1);

    // TODO transaction handling
    // TODO acks handling
    // TODO timeout handling

    const partitionResponses = [];
    req.body.topicData.forEach(topic => {
        topic.partitionData.forEach(partition => {
            // TODO error handling
            // TODO really need to get the `write` call to be asynchronous
            if (broker.metadata.topicExists(topic.name)) {
                const batch = new RecordBatch(partition.records).serialize()
                // TODO check partition exists
                broker.logController.write(topic.name, partition.index, batch);
                partitionResponses.push({
                    index: partition.index,
                    errorCode: errorCodes.NO_ERROR,
                    baseOffset: 0,
                    logAppendTimeMs: 0,
                    logStartOffset: 0, // TODO implement
                    recordErrors: []
                });
            } else {
                partitionResponses.push({
                    index: partition.index,
                    errorCode: errorCodes.UNKNOWN_TOPIC_OR_PARTITION,
                    baseOffset: 0,
                    logAppendTimeMs: 0,
                    logStartOffset: 0,
                    recordErrors: []
                });
            }
        });
    });

    // TODO probably want to build up the iterated response elements above
    // and avoid the double looping here
    res.send(new ProduceResponse({
        responses: req.body.topicData.map(topic => ({
            name: topic.name,
            partitionResponses,
        })),
        throttleTimeMs: 0 // TODO implement (broker-wide)
    }));
}

export default produceHandler;
