import { Mutex } from "async-mutex";
import {
    createReadStream,
    closeSync,
    existsSync,
    openSync,
    mkdirSync,
} from "node:fs";
import { appendFile, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

import { RecordBatchHeader } from "../protocol/fields/record_batch.js";

// TODO look into zero-copy optimizations with Node and make sure the
// fetch responses are being zero-copied

export default class LogController {
    #config;
    #locks = {};
    #segment = '0000000000000000' // TODO move this into partition metadata

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
        return join(this.#getLogDir(topicName, partition), `${this.#segment}.log`);
    }

    #getLogIndexName(topicName, partition) {
        return join(this.#getLogDir(topicName, partition), `${this.#segment}.index`);
    }

    // TODO sanitize topicName
    createLogDir(topicName, partition) {
        const logDir = this.#getLogDir(topicName, partition);
        mkdirSync(logDir, { recursive: true });
        closeSync(openSync(join(logDir, `${this.#segment}.log`), 'w'));
        closeSync(openSync(join(logDir, `${this.#segment}.index`), 'w'));
    }

    #read(topicName, partition, start = 0) {
        console.debug(`reading logs for ${topicName}`);
        // TODO error handling/mapping
        return new Promise((resolve, reject) => {
            const chunks = [];

            // TODO configure chunk size?
            const stream = createReadStream(
                this.#getLogFileName(topicName, partition),
                { start }
            );

            stream.on('data', (chunk) => {
                chunks.push(chunk);
            });
              
            stream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            
            stream.on('error', (err) => {
                reject(err);
            });
        })
        
    }

    async #getBatchStart(topicName, partition, fromOffset) {
        // TODO error handling/mapping
        const index = await readFile(this.#getLogIndexName(topicName, partition))
        let indexOffset = 0;
        let batchStart = null;
        while (indexOffset < index.length) {
            const offset = index.readBigInt64BE(indexOffset);
            if (offset === fromOffset) {
                batchStart = index.readInt32BE(indexOffset + 8);
                break;
            }
            // TODO implicit knowledge of index structure
            indexOffset += 12;
        }
        return batchStart;
    }

    async readBatches(topicName, partition, fromOffset = 0n) {
        let batchStart;
        if (!!fromOffset) {
            batchStart = await this.#getBatchStart(topicName, partition, fromOffset)
        } else {
            batchStart = 0;
        }

        // TODO error?
        if (batchStart === null) {
            return { batches: [], baseOffset: -1 }
        }

        // TODO error handling/mapping
        const data = await this.#read(topicName, partition, batchStart);
        const batches = [];
        let batchOffset = 0;
        let baseOffset = 0n;
        while (batchOffset < data.length) {
            const { value: batch, size } = RecordBatchHeader.deserialize(data, batchOffset);
            if (batchOffset === 0) {
                baseOffset = batch.baseOffset;
            }
            batches.push(data.subarray(batchOffset, batchOffset + size + batch.batchLength));
            batchOffset += size + batch.batchLength;
        }
        return {
            batches: batches.slice(Number(fromOffset - baseOffset)),
            baseOffset: baseOffset + fromOffset
        };
    }

    // TODO clarify record vs. metadata record
    async write(topicName, partition, batch) {
        // TODO custom mutex implementation that can take a key (i.e. the func params)
        const lockKey = [topicName, partition]
        if (!this.#locks[lockKey]) {
            this.#locks[lockKey] = new Mutex();
        }

        await this.#locks[lockKey].runExclusive(async () => {
            const offset = this.metadata.nextOffset(topicName);
            // TODO error handling
            const logFile = this.#getLogFileName(topicName, partition);
            const { size } = await stat(logFile);
            await appendFile(logFile, batch.serialize(offset));
            // TODO tighten up index data structure - max log size here ~2GB
            const indexEntry = Buffer.alloc(12);
            indexEntry.writeBigInt64BE(offset);
            indexEntry.writeInt32BE(size, 8);
            await appendFile(this.#getLogIndexName(topicName, partition), indexEntry);
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
