const errorCodes = {
    UNSUPPORTED_VERSION: 35
}

export class InvalidRequestError extends Error {
    constructor(code) {
        super('InvalidRequest')
        this.code = code;
    }
}

export default class Request {
    constructor(data) {
        this.length = data.readInt32BE();
        this.requestApiKey = data.readInt16BE(4);
        this.requestApiVersion = data.readInt16BE(6);
        this.correlationId = data.readInt32BE(8);
    }

    validate() {
        this.#validateApiVersion()
    }

    #validateApiVersion() {
        if (this.requestApiVersion > 4 || this.requestApiVersion < 0) {
            throw new InvalidRequestError(errorCodes.UNSUPPORTED_VERSION);
        }
    }
}
