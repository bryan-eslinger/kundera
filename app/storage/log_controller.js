import { Mutex } from "async-mutex";
import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readFileSync
} from "node:fs";
import { join } from "node:path";

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
    read(topicName, partition) {
        console.debug(`reading logs for ${topicName}`);
        const data = readFileSync(this.#getLogFileName(topicName, partition));
        // TODO error handling
        return { err: null, data };
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
