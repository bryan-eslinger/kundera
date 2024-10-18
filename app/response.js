export default class Response {
    constructor(correlationId) {
      this.correlationId = correlationId;
      this.messageLength = Buffer.alloc(4);
      this.message = Buffer.from([]);
    }

    sendError(code) {
      this.message = Buffer.alloc(2);
      this.message.writeInt16BE(code);
    }
  
    toBuffer() {
      const correlationId = Buffer.alloc(4);
      correlationId.writeInt32BE(this.correlationId);
      const body = Buffer.concat([correlationId, this.message])
      this.messageLength.writeInt32BE(body.length);
      return Buffer.concat([this.messageLength, body]);
    }
}
