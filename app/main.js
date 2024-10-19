import createBroker from "./broker.js";
import apiKeys from "./api_keys.js";
import { ApiVersionsBody } from "./message_bodies.js";

const { server } = createBroker();

server.handle(apiKeys.API_VERSIONS, (_, res) => {
    res.send(new ApiVersionsBody());
})

server.listen(9092, "127.0.0.1", () => {
    console.log("Server listening at tcp://localhost:9092");
});
