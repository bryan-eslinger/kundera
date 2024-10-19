import net from "net";

import Response from "./response.js";
import Request from "./request.js";
import { errorCodes } from "./error.js";
import { ErrorOnlyBody } from "./message_bodies.js";

class Kundera {
    constructor() {
        this.server = net.createServer(this.onConnection);
        this.handlers = {}
        this.server.handle = (apiKey, handler) => {
            this.handlers[apiKey] = handler;
        }
    }

    onConnection = (socket) => {
        socket.on("data", (data) => {
            console.debug("data received");
            // TODO error handling for totally malformed requests
            const request = new Request(data);
            const response = new Response(request, socket);
            
            const requestError = request.validate();
            if (!!requestError) {
                let errorCode;
                switch(requestError.message) {
                    case 'InvalidRequest':
                        errorCode = requestError.code;
                        break;
                    default:
                        errorCode = errorCodes.UNKNOWN_SERVER_ERROR;
                }
                response.send(new ErrorOnlyBody(errorCode));
                return;
            }

            const handler = this.handlers[request.requestApiKey];
            if (!handler) {
                response.send(new ErrorOnlyBody(errorCodes.RESOURCE_NOT_FOUND));
                return;
            }
    
            // TODO tighten up handler context maybe?
            handler(request, response);
    
            // TODO error handling when a handler does not invoke socket.end?
        });
    }
}

export default function createBroker() {
    const broker = new Kundera();
    return { broker, server: broker.server }
}
