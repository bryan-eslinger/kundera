import MessageLengthField from "./fields/message_length.js";

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
