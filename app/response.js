import { Int32Field, MessageLengthField, StructField, TaggedFields } from "./serializer.js";

class HeadersV0 {
    schema = new StructField([
        ['correlationId', Int32Field],
    ]);

    constructor(values) {
        this.values = Object.assign(values)
    }

    serialize() {
        console.debug('Response headers');
        console.debug(this.values);
        return this.schema.serialize(this.values);
    }
}

class HeadersV1 {
    schema = new StructField([
        ['correlationId', Int32Field],
        ['_taggedFields', TaggedFields],
    ]);

    constructor(values) {
        this.values = Object.assign({ _taggedFields: {} }, values)
    }

    serialize() {
        console.debug('Response headers');
        console.debug(this.values);
        return this.schema.serialize(this.values);
    }
}

export const headerVersions = {
    V0: HeadersV0,
    V1: HeadersV1,
}

export default class Response {
    #headers;

    constructor(request, socket) {
        this.request = request;
        this.socket = socket;
        this.#headers = null;
    }

    get correlationId() {
        return this.request.correlationId;
    }

    headers(version, values = {}) {
        this.#headers = new version({ ...{ correlationId: this.correlationId }, ...values });
    }

    send(bodyData) {
        const body = bodyData.serialize();
        // TODO error handling if headers have not been set
        const headers = this.#headers.serialize();
        const res = Buffer.concat([
            MessageLengthField.serialize(headers.length + body.length),
            headers,
            body
        ]);

        this.socket.write(res);
    }
}
