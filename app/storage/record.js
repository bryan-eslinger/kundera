import CompactBytes from "../protocol/types/compact_bytes.js";
import CompactNullableBytes from "../protocol/types/compact_nullable_bytes.js";
import Int8 from "../protocol/types/int8.js";
import Struct from "../protocol/types/struct.js";
import VarInt from "../protocol/types/var_int.js";

export default class Record {
    static schema = new Struct([
        ['attributes', Int8],
        ['timestampDelta', VarInt],
        ['offsetDelta', VarInt],
        ['key', CompactNullableBytes],
        ['value', CompactBytes],
        // ['headers', new CompactArray(Header)] // TODO headers
    ])

    // TODO extract schema-able kind of decorator
    constructor(values) {
        // TODO handle undefineds
        for (const [attr, _] of this.constructor.schema.fields) {
            this[attr] = values[attr]
        }
    }

    static deserialize(buffer, offset = 0) {
        return new Record(this.schema.deserialize(buffer, offset).value);
    }

    serialize() {
        return this.constructor.schema.serialize(this);
    }
}
