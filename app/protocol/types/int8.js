export default class Int8 {
    static size = 1;

    static deserialize(buffer, offset = 0) {
        console.log(`deserialized Int8 bytes ${offset} to ${offset + this.size - 1}`)
        return { value: buffer.readInt8(offset), size: this.size }
    }

    static serialize(value) {
        const buffer = Buffer.alloc(this.size);
        buffer.writeInt8(value);
        return buffer;
    }
}