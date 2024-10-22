export default class Int16 {
    static size = 2;

    static deserialize(buffer, offset = 0) {
        console.log(`deserialized Int16 bytes ${offset} to ${offset + this.size - 1}`)
        return { value: buffer.readInt16BE(offset), size: this.size }
    }

    static serialize(value) {
        const buffer = Buffer.alloc(this.size);
        buffer.writeInt16BE(value);
        return buffer;
    }
}
