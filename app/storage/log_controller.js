import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readFileSync
} from "node:fs";
import { join } from "node:path";
import RecordBatch from "./record_batch.js";
import Record from "./record.js";

// TODO look into zero-copy optimizations with Node and make sure the
// fetch responses are being zero-copied

export default class LogController {
    #batches = {};
    #broker;
    #config;

    constructor(broker) {
        this.#broker = broker;
        this.#config = broker.config;
        this.#bootstrap();
    }

    get #metadata() {
        return this.#broker.metadata;
    }

    #getLogDir(topicName, partition) {
        return join(this.#config.logdir, `${topicName}-${partition}`);
    }

    #getLogFileName(topicName, partition) {
        // TODO write to latest log file; this assumes only one per partition with no rolling
        return join(this.#getLogDir(topicName, partition), '0000000000000000.log')
    }

    flush(topicName, partition) {
        const records = this.#batches[[topicName, partition]];

        // TODO race conditions around writing additional records after a flush has been started
        // TODO real values for most of this
        const batch = new RecordBatch({
            baseOffset: 0,
            partitionLeaderEpoch: 0,
            magicByte: 0,
            attributes: 0,
            baseTimestamp: 0,
            maxTimestamp: 0,
            producerId: 0,
            producerEpoch: 0,
            baseSequence: 0,
            records
        });
        
        // TODO this is absolutely not going to scale,
        // need to use writeable streams in the end
        // but for now just want to get the pieces
        // working under low load and then transition
        // to a worker queue structure that can better
        // manage write streams
        appendFileSync(this.#getLogFileName(topicName, partition), batch.serialize());
        if (topicName === this.#config.metadataTopic) {
            // maybe write metadata records via the metadata class
            // and trigger the update there?
            this.#metadata.update();
        }
    }
    // TODO: take advantage of readFile async version to be able to
    // parallelize calls to read
    read(topicName, partition) {
        console.debug(`reading logs for ${topicName}`);

        const data = LogReader.read(this.#getLogFileName(topicName, partition))
        return { err: null, data };
    }

    // TODO clarify record vs. metadata record
    write(topicName, partition, recordType, recordValue) {
        const batchKey = [topicName, partition];
        if (!this.#batches[batchKey]) {
            this.#batches[batchKey] = []
        }

        // TODO performance implications of gc'ing this object?
        const record = new Record({
            attributes: 0,
            timestampDelta: 0,
            offsetDelta: this.#batches[batchKey].length - 1,
            key: null,
            value: {
                frameVersion: 0,
                recordType,
                version: 0,
                recordValue
            }
        });

        this.#batches[batchKey].push(record.serialize());
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
        this.#ensureMetadata(this.config);
    }
}

class LogReader {
    // TODO read at a given log offset
    static read(logFile, _offset) {
        console.debug(`reading ${logFile}`);
        // TODO error handling
        return readFileSync(logFile);
    }
}
