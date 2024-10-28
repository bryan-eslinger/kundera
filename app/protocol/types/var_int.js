import zigZag from "./utils/zig_zag.js";

// TODO implement with a ZigZagged decorator on UVarIntField
export default class VarInt {
    // TODO serialize
    static deserialize(buffer, offset = 0) {
        let value = 0;
        let shift = 0;
        let size = offset;

        while (true) {
            const byte = buffer[size++];

            value |= (byte & 0x7f) << shift;
            shift += 7;

            if ((byte & 0x80) === 0) {
                console.log(`deserialized VarInt bytes ${offset} to ${size - 1}`)
                return { value: zigZag.decode(value), size: size - offset };
            }
        }
    }

    static serialize(value) {
        let zigZagged = zigZag.encode(value);
        const result = [];
        while (zigZagged > 127) {
            result.push((zigZagged & 0x7f) | 0x80);
            zigZagged >>>= 7;
        }
        result.push(zigZagged | 0);
        return Buffer.from(result);
    }
}
