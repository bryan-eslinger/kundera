import { errorCodes } from "../../error.js";
import Response, { headerVersions } from "../../response.js";
import DescribeTopicPartitionsBody from "./schema.js";

const describeTopicPartitions = (req, res) => {
    res.headers(headerVersions.V1);
    
    // TODO actually look for the topic and partition data
    res.send(new DescribeTopicPartitionsBody({
        throttleTimeMs: 0,
        topics: req.body.topics.map((topic) => ({
            errorCode: errorCodes.UNKNOWN_TOPIC_OR_PARTITION,
            name: topic.name,
            topicId: '00000000-0000-0000-0000-000000000000',
            isInternal: false,
            partitions: [],
            topicAuthorizedOperations: 0
        })),
    }))
}

export default describeTopicPartitions;
