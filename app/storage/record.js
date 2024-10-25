import CompactBytes from "../protocol/types/compact_bytes.js";
import CompactNullableString from "../protocol/types/compact_nullable_string.js";
import Int8 from "../protocol/types/int8.js";
import Struct from "../protocol/types/struct.js";
import VarInt from "../protocol/types/var_int.js";
import { metaDataRecordTypes } from "../metadata/index.js";

export default class Record {
    static schema = new Struct([
        ['attributes', Int8],
        ['timestampDelta', VarInt],
        ['offsetDelta', VarInt],
        ['key', CompactNullableString],
        ['value', new Struct([
            ['frameVersion', Int8],
            ['recordType', Int8],
            ['version', Int8],
            ['recordValue', CompactBytes]
        ])]
    ]);

    constructor(values) {
        // TODO handle undefineds
        for (const [attr, _] of this.constructor.schema.fields) {
            this[attr] = values[attr]
        }
    }

    static deserialize(buffer) {
        const values = this.schema.deserialize(buffer).value;
        values.value.recordValue = metaDataRecordTypes[values.value.recordType]
            .deserialize(values.value.recordValue)
            .value;
        return new Record(values)
    }

    serialize() {
        return this.constructor.schema.serialize({
            ...this,
            value: {
                ...this.value,
                recordValue: metaDataRecordTypes[this.value.recordType]
                    .serialize(this.value.recordValue)
            }
        });
    }
}
