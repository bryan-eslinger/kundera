import { Mutex } from "async-mutex";
import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readFileSync
} from "node:fs";
import { join } from "node:path";

import { RecordBatchHeader } from "../protocol/fields/record_batch.js";

// TODO look into zero-copy optimizations with Node and make sure the
// fetch responses are being zero-copied

export default class LogController {
    #config;
    #locks = {};

    constructor(config, metadata) {
        this.#config = config;
        this.#bootstrap();
        this.metadata = metadata;
    }

    #getLogDir(topicName, partition) {
        return join(this.#config.logdir, `${topicName}-${partition}`);
    }

    #getLogFileName(topicName, partition) {
        // TODO write to latest log file; this assumes only one per partition with no rolling
        return join(this.#getLogDir(topicName, partition), '0000000000000000.log')
    }

    // TODO sanitize topicName
    createLogDir(topicName, partition) {
        const logDir = this.#getLogDir(topicName, partition);
        mkdirSync(logDir, { recursive: true });
        // TODO segmenting / source of truth for file name
        closeSync(openSync(join(logDir, '0000000000000000.log'), 'w'));
    }

    // TODO: take advantage of readFile async version to be able to
    // parallelize calls to read
    // TODO: read starting from an offset
    #read(topicName, partition) {
        console.debug(`reading logs for ${topicName}`);
        const data = readFileSync(this.#getLogFileName(topicName, partition));
        // TODO error handling
        return { err: null, data };
    }

    readBatches(topicName, partition, fromOffset = 0n) {
        const { data, err } = this.#read(topicName, partition);

        if (err) {
            return { err, batches: [] }
        }
        
        const batches = [];
        let batchOffset = 0;
        let baseOffset = -1n;
        while (batchOffset < data.length) {
            const { value: batch, size } = RecordBatchHeader.deserialize(data, batchOffset);
            if (batchOffset === 0) {
                baseOffset = batch.baseOffset;
            }
            batches.push(data.subarray(batchOffset, batchOffset + size + batch.batchLength))
            batchOffset += size + batch.batchLength
        }

        return {
            batches: batches.slice(Number(fromOffset - baseOffset)),
            baseOffset: baseOffset + fromOffset
        };
    }

    // TODO clarify record vs. metadata record
    async write(topicName, partition, batch) {
        // TODO this is absolutely not going to scale,
        // need to use writeable streams in the end
        // but for now just want to get the pieces
        // working under low load and then transition
        // to promise- or callback-based IO

        // TODO index

        // TODO custom mutex implementation that can take a key (i.e. the func params)
        const lockKey = [topicName, partition]
        if (!this.#locks[lockKey]) {
            this.#locks[lockKey] = new Mutex();
        }

        await this.#locks[lockKey].runExclusive(() => {
            const offset = this.metadata.nextOffset(topicName);
            appendFileSync(this.#getLogFileName(topicName, partition), batch.serialize(offset));
            this.metadata.incrementOffset(topicName);
        });
    }

    #ensureMetadata() {
        // TODO use create topic mechanism to create the metadata?
        // either way, need to not hardcode this sort of thing
        const logDir = this.#getLogDir(this.#config.metadataTopic, 0)
        if (!existsSync(logDir)) {
            mkdirSync(logDir, { recursive: true });
        }
    }
    
    #bootstrap() {
        this.#ensureMetadata(this.#config);
    }
}
