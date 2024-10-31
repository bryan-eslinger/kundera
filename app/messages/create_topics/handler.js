import { errorCodes } from "../../error.js";
import { createTopics } from "../../metadata/topic.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import CreateTopicsResponse from "./schema.js";

// TODO error handling
const createTopicsHandler = async (req, res) => {
    res.headers(headerVersions.V1);

    const topics = await createTopics(req.body.topics.map(topic => topic.name));
        
    res.send(new CreateTopicsResponse({
        throttleTimeMs: 0,
        topics: topics.map(topic => ({
            name: topic.name,
            topicId: topic.topicId,
            errorCode: errorCodes.NO_ERROR,
            numPartitions: 1,
            replicationFactor: 0,
            configs: []
        }))
    }));
}

export default createTopicsHandler;
