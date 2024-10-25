import UVarInt from "./u_var_int.js";

export default class CompactBytes {
    // TODO implement the deserialize
    static deserialize(buffer, offset) {
        const { value: length, size: lengthSize } = UVarInt.deserialize(buffer, offset)
        return {
            value: buffer.subarray(offset + lengthSize, offset + lengthSize + length - 1),
            size: lengthSize + length - 1
        }
    }

    static serialize(value) {
        return Buffer.concat([
            UVarInt.serialize(value.length + 1),
            value
        ]);
    }
}
