import net from "net";

import Response from "./response.js";
import Request from "./request.js";

const server = net.createServer((socket) => {
    socket.on("connection", (socket) => {
        console.debug("new connection")
    })

    socket.on("data", (data) => {
        console.debug("data received");
        const request = new Request(data);
        const response = new Response(request.correlationId);
        socket.end(response.toBuffer());
    });
});

server.listen(9092, "127.0.0.1");
