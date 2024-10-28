import VarInt from "./var_int.js";

export default class CompactNullableBytes {
    // TODO implement the deserialize
    static deserialize(buffer, offset) {
        const { value: length, size: lengthSize } = VarInt.deserialize(buffer, offset);
        
        if (length === -1) {
            return {
                value: null,
                size: lengthSize
            };
        }

        console.log(`deserialized CompactNullableBytes ${offset + lengthSize} to ${offset + lengthSize + length - 1}`)
        
        return {
            value: buffer.subarray(offset + lengthSize, offset + lengthSize + length),
            size: lengthSize + length
        }
    }

    static serialize(value) {
        if (value == null) {
            return Buffer.alloc(1);
        }

        return Buffer.concat([
            VarInt.serialize(value.length),
            value
        ]);
    }
}
