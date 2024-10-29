import { randomBytes } from "node:crypto";
import { createConnection } from "node:net";

import HeadersV0 from "../protocol/fields/request/headers_v0.js";
import MessageLengthField from "../protocol/fields/message_length.js";


export default class Client {
    socket = null;

    constructor(config) {
        this.config = config;
    }

    connect(cb) {
        const socket = createConnection(9092, 'localhost', () => {
            console.log('Connected');
            this.socket = socket;
    
            socket.on('close', function() {
                // TODO reconnect to next broker / leader
                console.log('Connection closed');
                socket.destroy();
            });

            cb();
        });
    }

    request(type, version, body, correlationId = null) {
        const headers = new HeadersV0({
            requestApiKey: type,
            requestApiVersion: version,
            correlationId: correlationId ? correlationId : Math.abs(randomBytes(4).readInt32BE()),
            clientId: 'kundera-client'
        }).serialize();

        const requestLength = MessageLengthField.serialize(headers.length + body.length)
        
        return new Promise(resolve => {
            this.socket.write(Buffer.concat([requestLength, headers, body]));
            this.socket.once('data', (data) => {
                resolve(data);
                this.socket.destroy();
            });
        })
    }
}
