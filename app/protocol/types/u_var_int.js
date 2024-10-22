export default class UVarInt {
    static serialize(value) {
        const result = [];
        while (value > 0x7f) {
            result.push((value & 0x7f) | 0x80);
            value >>>= 7;
        }
        result.push(value);
        return Buffer.from(result);
    }

    static deserialize(buffer, offset = 0) {
        let value = 0;
        let shift = 0;
        let size = offset;

        while (true) {
            const byte = buffer[size++];

            value |= (byte & 0x7f) << shift;
            shift += 7;

            if ((byte & 0x80) === 0) {
                console.log(`deserialized UVarInt bytes ${offset} to ${size - 1}`)
                return { value, size: size - offset };
            }
        }
    }
}
