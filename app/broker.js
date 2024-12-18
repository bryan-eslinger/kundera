import { createServer } from "net";

import { headerVersions } from "./protocol/fields/response/index.js";
import Response from "./protocol/response.js";
import Request from "./protocol/request.js";
import { errorCodes } from "./error.js";
import ErrorResponse from "./messages/error/schema.js";
import config from "./config/index.js";
import LogController from "./storage/log_controller.js";
import Metadata from "./metadata/index.js";
import MetadataController from "./metadata/controller.js";

class Kundera {
    constructor() {
        this.config = config();
        this.handlers = {}
        this.metadata = new Metadata();
        this.logController = new LogController(this.config, this.metadata);
        this.metadataController = new MetadataController(this.config.metadataTopic, this.metadata, this.logController);
        this.server = createServer(this.onConnection);
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
                response.headers(headerVersions.V0);
                response.send(new ErrorResponse({ errorCode }));
                return;
            }

            const handler = this.handlers[request.requestApiKey];
            if (!handler) {
                response.headers(headerVersions.V0);
                response.send(new ErrorResponse({ errorCode: errorCodes.RESOURCE_NOT_FOUND }));
                return;
            }
    
            // TODO tighten up handler context maybe?
            handler(request, response);
        });
    }
}

export default function createBroker() {
    const broker = new Kundera();
    return { broker, server: broker.server }
}
