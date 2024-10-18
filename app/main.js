import net from "net";

import Response from "./response.js";
import Request from "./request.js";

function handleError(response, err) {
    console.debug('handling error', err);
    switch(err.message) {
        case 'InvalidRequest':
            response.sendError(err.code);
            break;
        default:
            response.sendError(-1);
    }
}

const server = net.createServer((socket) => {
    socket.on("connection", (socket) => {
        console.debug("new connection")
    })

    socket.on("data", (data) => {
        console.debug("data received");
        const request = new Request(data);
        const response = new Response(request.correlationId);

        try {
            request.validate()
        } catch (err) {
            handleError(response, err)
        }

        socket.end(response.toBuffer());
    });
});

server.listen(9092, "127.0.0.1");
