import { Int32Field, MessageLengthField, StructField } from "./serializer.js";

class Headers {
    schema = new StructField([
        ['correlationId', Int32Field]
    ]);

    constructor(values) {
        this.values = values
    }

    serialize() {
        console.debug('Response headers');
        console.debug(this.values);
        return this.schema.serialize(this.values);
    }
}

export default class Response {
    constructor(request, socket) {
        this.request = request;
        this.socket = socket;
        this.headers = new Headers({ correlationId: request.correlationId });
    }

    get correlationId() {
        return this.request.correlationId;
    }

    send(bodyData) {
        const body = bodyData.serialize();
        const headers = this.headers.serialize();
        const res = Buffer.concat([
            MessageLengthField.serialize(headers.length + body.length),
            headers,
            body
        ]);

        this.socket.write(res);
    }
}
