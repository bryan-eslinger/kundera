import RecordValue from "../metadata/record_value.js";
import Record from "../storage/record.js";
import RecordBatch, { RecordBatchHeader } from "../protocol/fields/record_batch.js";

export default class Controller {
    logController;
    metadata;
    topicName;

    constructor(topicName, metadata, logController) {
        this.logController = logController
        this.metadata = metadata
        this.topicName = topicName;
        this.#bootstrap();
    }

    #bootstrap() {
        this.update();
        this.#hydrateTopicOffsets();
    }

    #hydrateTopicOffsets() {
        const topicOffsets = {};
        this.metadata.knownTopics.forEach(topic => {
            const { data } = this.logController.read(topic, 0);
            let batchOffset = 0;
            let lastOffset = -1;
            while (batchOffset < data.length) {
                const { value: batch, size } = RecordBatchHeader.deserialize(data, batchOffset);
                lastOffset = batch.baseOffset;
                batchOffset += size + batch.batchLength
            }
            topicOffsets[topic] = lastOffset;
        });
        this.metadata.topicOffsets = topicOffsets;
    }

    readBatches() {
        // TODO error handling
        const { data } = this.logController.read(this.topicName, 0);
        const batches = []
        let batchOffset = 0;
        while (batchOffset < data.length) {
            const { value, size } = RecordBatch.deserialize(data, batchOffset);
            batches.push(value);
            batchOffset += size;
        }
        batches.forEach(batch => {
            batch.records = batch.records.map(record => this.#readRecord(record));
        })
        return batches;
    }

    #readRecord(data) {
        const record = Record.deserialize(data);
        record.value = RecordValue.deserialize(record.value);
        return record
    }

    writeRecords(records) {
        const batch = new RecordBatch({
            magicByte: 0,
            crc: 0,
            attributes: 0,
            baseTimestamp: 0,
            maxTimestamp: 0,
            producerId: -1,
            producerEpoch: -1,
            baseSequence: 0,
            records: records.map(([recordType, recordValue]) => (
                new Record({
                    attributes: 0,
                    timestampDelta: 0,
                    offsetDelta: 0,
                    key: null,
                    value: new RecordValue({
                        frameVersion: 0,
                        recordType,
                        version: 0,
                        recordValue
                    }).serialize()
                }).serialize()
            ))
        })

        this.logController.write(this.topicName, 0, batch);
        this.update();
    }

    update() {
        // TODO error handling
        // TODO incremental updates
        // TODO think through first run scenario better
        // does __cluster_metadata get its own entry in
        // __cluster_metadata? right now we just start with
        // no metadata log
        let batches;
        try {
            batches = this.readBatches();
        } catch (e) {
            // TODO tighter error handling
            if (e.code !== 'ENOENT') {
                throw e
            }
            batches = [];
        }

        this.metadata.records = batches.map(batch => (
            batch.records.map(record => record)
        )).flat();
    }
}
