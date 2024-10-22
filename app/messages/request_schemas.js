import apiKeys from "../api_keys.js";
import ApiVersionsRequest from "./api_versions/request.js";
import DescribeTopicPartitionsRequest from "./describe_topic_partitions/request.js";
import FetchRequest from "./fetch/request.js";

const schemas = {
    [apiKeys.API_VERSIONS]: ApiVersionsRequest,
    [apiKeys.DESCRIBE_TOPIC_PARTITIONS]: DescribeTopicPartitionsRequest,
    [apiKeys.FETCH]: FetchRequest
}

export default schemas;
