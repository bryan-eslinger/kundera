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
        this.#lengthField = Int32Field;
        // TODO: support client_id and tagged_fields fields
        this.#headersField = new StructField([
            ['requestApiKey', Int16Field],
            ['requestApiVersion', Int16Field],
            ['correlationId', Int32Field]
        ]);
        console.debug('Request headers');
        console.debug(this.headers);
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

    // TODO think through return structure when handling multiple validations
    // e.g. length
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
