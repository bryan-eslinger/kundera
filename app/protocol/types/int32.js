export default class Int32 {
    static size = 4;

    static deserialize(buffer, offset = 0) {
        console.log(`deserialized Int8 bytes ${offset} to ${offset + this.size - 1}`)
        return { value: buffer.readInt32BE(offset), size: this.size }
    }

    static serialize(value) {
        const buffer = Buffer.alloc(this.size);
        buffer.writeInt32BE(value);
        return buffer;
    }
}
