import apiKeys from "./api_keys.js";
import createBroker from "./broker.js";
import apiVersionsHandler from "./messages/api_versions/handler.js";
import describeTopicPartitionsHandler from "./messages/describe_topic_partitions/handler.js";
import fetchHandler from "./messages/fetch/handler.js";

const { server } = createBroker();

server.handle(apiKeys.API_VERSIONS, apiVersionsHandler);
server.handle(apiKeys.DESCRIBE_TOPIC_PARTITIONS, describeTopicPartitionsHandler);
server.handle(apiKeys.FETCH, fetchHandler);

server.listen(9092, "127.0.0.1", () => {
    console.log("Server listening at tcp://localhost:9092");
});
