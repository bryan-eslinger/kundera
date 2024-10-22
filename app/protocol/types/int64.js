export default class Int64 {
    static size = 8;

    static deserialize(buffer, offset = 0) {
        console.log(`deserialized Int64 bytes ${offset} to ${offset + this.size - 1}`)
        return { value: buffer.readBigInt64BE(offset), size: this.size }
    }

    static serialize(value) {
        const buffer = Buffer.alloc(this.size);
        buffer.writeBigInt64BE(BigInt(value));
        return buffer;
    }
}
