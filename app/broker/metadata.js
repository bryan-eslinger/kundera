import { CLUSTER_METADATA_LOGFILE } from "../config/logs.js"
import { readLog } from "../storage/log.js";

// TODO incremental updates from offset
export default class Metadata {
    records;

    constructor() {
        this.update();
    }

    update() {
        this.records = readLog(CLUSTER_METADATA_LOGFILE);
    }
}