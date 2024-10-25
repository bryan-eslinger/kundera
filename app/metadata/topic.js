import { v4 as uuidv4 } from "uuid";

import broker from "../index.js";
import { metaDataRecordTypeKeys } from "./index.js";

// TODO make async to allow parallelization via promises
export function createTopics(names) {
    const META_DATA_PARTITION = 0;
    
    const PARTITIONS = [0];
    // TODO error handling
    const topics = names.map(name => {
        const topicId = uuidv4();
        // TODO: really confirm the uuid is unique?
        broker.logController.write(
            broker.config.metadataTopic,
            META_DATA_PARTITION,
            metaDataRecordTypeKeys.TOPIC,
            { name, topicId }
        );
    
        PARTITIONS.forEach(partitionId => {
            broker.logController.write(
                broker.config.metadataTopic,
                META_DATA_PARTITION,
                metaDataRecordTypeKeys.PARTITION,
                {
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
                }
            )
        });
        return { name, topicId };
    });

    broker.logController.flush(broker.config.metadataTopic, META_DATA_PARTITION);
    return topics;
}
