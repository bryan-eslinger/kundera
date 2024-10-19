import { errorCodes } from "./error.js";
import { Int16Field, Int32Field, StructField } from "./serializer.js";

class InvalidRequestError extends Error {
    constructor(code) {
        super('InvalidRequest')
        this.code = code;
    }
}

export default class Request {
    #_headers = null;
    #_length = null;
    #headersField;
    #lengthField;

    constructor(data) {
        this.data = data;
        this.#lengthField = new Int32Field();
        // TODO: support client_id and tagged_fields fields
        this.#headersField = new StructField(
            {},
            ['requestApiKey', 'requestApiVersion', 'correlationId'],
            [Int16Field, Int16Field, Int32Field]
        );
    }

    get correlationId() {
        return this.headers.correlationId;
    }

    get headers() {
        if (this.#_headers === null) {
            this.#_headers = this.#headersField.deserialize(
                this.data,
                this.#lengthField.size
            );
        }
        return this.#_headers;
    }

    get length() {
        if (this.#_length === null) {
            this.#_length = this.#lengthField.deserialize(this.data);
        }
        return this.#_length;
    }

    get requestApiKey() {
        return this.headers.requestApiKey;
    }

    get requestApiVersion() {
        return this.headers.requestApiVersion;
    }

    // TODO think through return structure if ever handling multiple validations
    validate() {
        return this.#validateApiVersion()
    }

    // TODO think through a runtime config option for this
    // -> see also message_bodies.js / the APIVersions response
    #validateApiVersion() {
        if (this.requestApiVersion > 4 || this.requestApiVersion < 0) {
            return new InvalidRequestError(errorCodes.UNSUPPORTED_VERSION);
        }
    }
}
