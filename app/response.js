import { Int32Field, MessageLength, StructField } from "./serializer.js";

export default class Response {
    constructor(request, socket) {
        this.request = request;
        this.socket = socket;
        this.headers = new StructField({
            correlationId: request.correlationId
        }, ['correlationId'], [Int32Field])
    }

    get correlationId() {
        return this.request.correlationId;
    }

    send(messageBody) {
        const message = Buffer.alloc(this.headers.size + messageBody.size);
        this.headers.serializeInto(message, 0);
        messageBody.serializeInto(message, this.headers.size);
        this.socket.write(Buffer.concat([MessageLength.serializeFor(message), message]));
    }
}
