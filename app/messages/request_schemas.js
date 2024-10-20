import apiKeys from "../api_keys.js";
import ApiVersionsRequest from "./api_versions/request.js";
import DescribeTopicPartitionsRequest from "./describe_topic_partitions/request.js";

const schemas = {
    [apiKeys.API_VERSIONS]: ApiVersionsRequest,
    [apiKeys.DESCRIBE_TOPIC_PARTITIONS]: DescribeTopicPartitionsRequest,
}

export default schemas;
