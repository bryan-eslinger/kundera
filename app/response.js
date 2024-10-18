export default class Response {
    constructor(correlationId) {
      this.correlationId = correlationId;
      this.messageLength = Buffer.alloc(4);
    }
  
    toBuffer() {
      const message = Buffer.alloc(4);
      message.writeInt32BE(this.correlationId);
      this.messageLength.writeInt32BE(message.length);
      return Buffer.concat([this.messageLength, message]);
    }
}
