import UVarInt from "./u_var_int.js";

// TODO implement with Compactable decorator on StringField
// TODO error handling
export default class CompactString {
    static deserialize(buffer, offset = 0) {
        const {
            value: length,
            size: lengthSize
        } = UVarInt.deserialize(buffer, offset);

        console.log(`deserialized CompactString bytes ${offset + 1} to ${offset + length - 1 + lengthSize - 1}`)

        return {
            value: buffer
                .subarray(offset + lengthSize, offset + lengthSize + length - 1)
                .toString(),
            size: length - 1 + lengthSize
        }
    }

    static serialize(value) {
        return Buffer.concat([
            UVarIntField.serialize(value.length + 1),
            Buffer.from(value)
        ]);
    }
}
