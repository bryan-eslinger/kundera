import Record from "../storage/record.js";
import RecordBatch from "../storage/record_batch.js";

export default class Metadata {
    consumerTopics = null;
    logController;
    records = [];
    topicName;

    constructor(topicName, logController) {
        this.logController = logController
        this.topicName = topicName;
        this.update();
    }

    // TODO better caching
    getTopicName(topicId) {
        console.debug(`resolving topic name for ${topicId}`);
        if (this.consumerTopics === null) {
            this.consumerTopics = Object.fromEntries(
                this.records
                    .filter(record => record.recordType === metaDataRecordTypeKeys.TOPIC_RECORD)
                    .map(topicRecord => [topicRecord.recordValue.topicId, topicRecord.recordValue.name])
            );
        }
    
        return this.consumerTopics[topicId]
    }

    readBatches() {
        const batches = [];
        const { data } = this.logController.read(this.topicName, 0);

        let offset = 0;
        while (offset < data.length) {
            // TODO handle malformed logs?
            
            // +8 to skip the baseOffset
            // TODO is there a way to do this without the implicit 
            // dependency on the recordbatch schema?
            // probably want to just move this into the RecordBatch
            // deserializer and have it return an array of RecordBatch
            // instances, i.e. any record batches in the given data buffer
            const batchLength = data.readInt32BE(offset + 8);
            batches.push(RecordBatch.deserialize(
                data.subarray(offset, offset + batchLength))
            );
            offset += batchLength;
        }
        return batches;
    }

    writeRecord(record) {}

    update() {
        // TODO error handling
        // TODO incremental updates
        // TODO think better through first run scenario
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

        this.records = batches.map(batch => (
            batch.records.map(record => (
                Record.deserialize(record)
            ))
        )).flat();
    }
}
