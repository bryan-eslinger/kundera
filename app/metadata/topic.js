import { v4 as uuidv4 } from "uuid";

import broker from "../index.js";
import { metaDataRecordTypeKeys } from "./index.js";

// TODO make async to allow parallelization via promises
export function createTopics(names) {
    const PARTITIONS = [0];
    const topics = [];
    // TODO error handling
    const records = [];
    names.forEach(name => {
        const topicId = uuidv4();
        // TODO: really confirm the uuid is unique?
        records.push([
            metaDataRecordTypeKeys.TOPIC,
            { name, topicId }
        ]);
    
        PARTITIONS.forEach(partitionId => {
            records.push([metaDataRecordTypeKeys.PARTITION, {
                partitionId,
                topicId,
                replicas: [],
                isr: [],
                removingReplicas: [],
                addingReplicas: [],
                leader: partitionId,
                leaderEpoch: 0,
                partitionEpoch: 0,
                directories: [],
                eligibleLeaderReplicas: [partitionId],
                lastKnownElr: [partitionId]
            }]);
        });
        topics.push({ name, topicId });
    });

    broker.metadataController.writeRecords(records);
    // TODO partitions
    names.forEach(name => broker.logController.createLogDir(name, 0));
    return topics;
}
