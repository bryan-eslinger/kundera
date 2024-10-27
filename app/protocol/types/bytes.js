import Int32 from "./int32.js";

export default class Bytes {
    // TODO implement the deserialize
    static deserialize(buffer, offset) {
        const { value: length, size: lengthSize } = Int32.deserialize(buffer, offset)
        return {
            value: buffer.subarray(offset + lengthSize, offset + lengthSize + length),
            size: lengthSize + length
        }
    }

    static serialize(value) {
        return Buffer.concat([
            Int32.serialize(value.length),
            value
        ]);
    }
}
