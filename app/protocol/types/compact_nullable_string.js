import UVarInt from "./u_var_int.js";
import { NULL_STRING_BYTE } from "./index.js";

// TODO implement with Compactable and Nullable decorators on StringField
export default class CompactNullableString {
    static deserialize(buffer, offset = 0) {
        const {
            value: length,
            size: lengthSize
        } = UVarInt.deserialize(buffer, offset);

        if (length === NULL_STRING_BYTE) {
            return {
                value: null,
                size: lengthSize
            };
        }

        console.log(`deserialized CompactNullableString bytes ${offset + lengthSize} to ${offset + length - 1 + lengthSize - 1}`)
        return {
            value: buffer
                .subarray(offset + lengthSize, offset + lengthSize + length - 1)
                .toString(),
            size: length - 1 + lengthSize
        }
    }

    static serialize(value) {
        if (value == null) {
            return Buffer.alloc(1);
        }
        return Buffer.concat([
            UVarInt.serialize(value.length + 1),
            Buffer.from(value)
        ]);
    }
}
