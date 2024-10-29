import apiKeys from "../api_keys.js";
import ApiVersionsRequest from "./api_versions/request.js";
import CreateTopicsRequest from "./create_topics/request.js";
import DescribeTopicPartitionsRequest from "./describe_topic_partitions/request.js";
import FetchRequest from "./fetch/request.js";
import ProduceRequest from "./produce/request.js";

const schemas = {
    [apiKeys.API_VERSIONS]: ApiVersionsRequest,
    [apiKeys.CREATE_TOPICS]: CreateTopicsRequest,
    [apiKeys.DESCRIBE_TOPIC_PARTITIONS]: DescribeTopicPartitionsRequest,
    [apiKeys.FETCH]: FetchRequest,
    [apiKeys.PRODUCE]: ProduceRequest,
}

export default schemas;
