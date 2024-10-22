export default class Boolean_ {
    static size = 1;

    static deserialize(buffer, offset = 0) {
        console.debug(`deserialized Boolean bytes ${offset} to ${offset + this.size - 1}`)
        return {
            value: Boolean(buffer.readInt8(offset)),
            size: this.size
        };
    }

    static serialize(value) {
        const buffer = Buffer.alloc(1);
        if (!!value) { buffer.writeInt8(1); }

        return buffer
    }
}
