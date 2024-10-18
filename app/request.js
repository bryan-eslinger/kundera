export default class Request {
    constructor(data) {
        this.length = data.readInt32BE();
        this.requestApiKey = data.readInt16BE(4);
        this.requestApiVersion = data.readInt16BE(6);
        this.correlationId = data.readInt32BE(8);
        console.debug(this.correlationId);
    }
}
