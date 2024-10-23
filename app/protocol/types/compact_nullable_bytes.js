import UVarInt from "./u_var_int.js";

export default class CompactNullableBytes {
    // TODO implement the deserialize
    static deserialize(_buffer, _offset) {
        throw new Error('not implemented');
        // read the length then return a buffer.subarray
    }

    static serialize(value) {
        if (value == null) {
            return Buffer.alloc(1);
        }

        return Buffer.concat([
            UVarInt.serialize(value.length + 1),
            value
        ]);
    }
}
