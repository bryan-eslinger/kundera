import Int32 from "./int32.js";

export default class NullableBytes {
    // TODO implement the deserialize
    static deserialize(buffer, offset) {
        const { value: length, size: lengthSize } = Int32.deserialize(buffer, offset);

        if (length === -1) {
            return {
                value: null,
                size: lengthSize
            }
        }

        console.log(`deserialized NullableBytes ${offset + lengthSize} to ${offset + lengthSize + length}`)

        return {
            value: buffer.subarray(offset + lengthSize, offset + lengthSize + length),
            size: lengthSize + length
        }
    }

    static serialize(value) {
        if (value == null) {
            return Buffer.alloc(4, 0xff);
        }
        return Buffer.concat([
            Int32.serialize(value.length),
            value
        ]);
    }
}
