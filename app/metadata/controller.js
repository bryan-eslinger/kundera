import RecordValue from "../metadata/record_value.js";
import Record from "../storage/record.js";
import RecordBatch from "../protocol/fields/record_batch.js";

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

    async #bootstrap() {
        await this.update();
        this.#hydrateTopicOffsets();
    }

    async #hydrateTopicOffsets() {
        const topicOffsets = {};
        await this.metadata.knownTopics.forEach(async (topic) => {
            const { batches, baseOffset } = await this.logController.readBatches(topic, 0);
            topicOffsets[topic] = baseOffset + BigInt(batches.length - 1);
        });
        const { batches, baseOffset } = await this.logController.readBatches(this.topicName, 0);
        topicOffsets[this.topicName] = baseOffset + BigInt(batches.length - 1);
        this.metadata.topicOffsets = topicOffsets;
    }

    async readBatches() {
        // TODO error handling
        const { batches } = await this.logController.readBatches(this.topicName, 0);
        
        return batches.map(batch => {
            const { value } = RecordBatch.deserialize(batch);
            value.records = value.records.map(record => this.#readRecord(record));
            return value;
        })
    }

    #readRecord(data) {
        const record = Record.deserialize(data);
        record.value = RecordValue.deserialize(record.value);
        return record
    }

    async writeRecords(records) {
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

        await this.logController.write(this.topicName, 0, batch);
        this.update();
    }

    async update() {
        // TODO error handling
        // TODO incremental updates
        // TODO think through first run scenario better
        // does __cluster_metadata get its own entry in
        // __cluster_metadata? right now we just start with
        // no metadata log
        let batches;
        try {
            batches = await this.readBatches();
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
