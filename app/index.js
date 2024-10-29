import apiKeys from "./api_keys.js";
import createBroker from "./broker.js";
import apiVersionsHandler from "./messages/api_versions/handler.js";
import createTopicsHandler from "./messages/create_topics/handler.js";
import describeTopicPartitionsHandler from "./messages/describe_topic_partitions/handler.js";
import fetchHandler from "./messages/fetch/handler.js";
import produceHandler from "./messages/produce/handler.js";

const { broker, server } = createBroker();

server.handle(apiKeys.API_VERSIONS, apiVersionsHandler);
server.handle(apiKeys.CREATE_TOPICS, createTopicsHandler);
server.handle(apiKeys.DESCRIBE_TOPIC_PARTITIONS, describeTopicPartitionsHandler);
server.handle(apiKeys.FETCH, fetchHandler);
server.handle(apiKeys.PRODUCE, produceHandler);

server.listen(9092, "127.0.0.1", () => {
    console.log("Server listening at tcp://localhost:9092");
    console.debug('Config:');
    console.debug(broker.config);
});

export default broker;
