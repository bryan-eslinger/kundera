import { errorCodes } from "./error.js";
import RequestSchemas from "./messages/request_schemas.js";
import {
    Int16Field,
    Int32Field,
    NullableStringField,
    StructField,
    TaggedFields
} from "./serializer.js";

class InvalidRequestError extends Error {
    constructor(code) {
        super('InvalidRequest')
        this.code = code;
    }
}

// TODO: need to work out handling multiple API versions cleanly
class Headers {
    schema = new StructField([
        ['requestApiKey', Int16Field],
        ['requestApiVersion', Int16Field],
        ['correlationId', Int32Field],
        ['clientId', NullableStringField],
        ['_taggedFields', TaggedFields]
    ]);

    constructor() {
        this.size = null;
    }

    deserialize(buffer, offset) {
        const { value, size } = this.schema.deserialize(buffer, offset);
        this.size = size;
        return value;
    }
}

export default class Request {
    #_body = null;
    #_headers = null;
    #_length = null;
    #headersField;
    #lengthField;

    constructor(data) {
        this.rawData = data;
        this.#lengthField = Int32Field;
        // TODO: support client_id and tagged_fields fields
        this.#headersField = new Headers();
        console.debug('Request headers');
        console.debug(this.headers);

        console.debug('Request body');
        console.debug(this.body);
    }

    get body() {
        if (this.#_body === null) {
            const schema = new RequestSchemas[this.requestApiKey]()
            this.#_body =schema.deserialize(
                this.rawData,
                this.#lengthField.size + this.#headersField.size
            );
        }
        return this.#_body
    }

    get correlationId() {
        return this.headers.correlationId;
    }

    get headers() {
        if (this.#_headers === null) {
            this.#_headers = this.#headersField.deserialize(
                this.rawData,
                this.#lengthField.size
            );
        }
        return this.#_headers;
    }

    get length() {
        if (this.#_length === null) {
            this.#_length = this.#lengthField.deserialize(this.rawData).value;
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
