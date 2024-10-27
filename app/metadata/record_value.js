import Int8 from "../protocol/types/int8.js";
import Struct from "../protocol/types/struct.js";
import { metaDataRecordTypes } from "../metadata/index.js";
import RawBytes from "../protocol/types/raw_bytes.js";

// TODO simply the schema using storage/record as base
export default class RecordValue {
    static schema = new Struct([
        ['frameVersion', Int8],
        ['recordType', Int8],
        ['version', Int8],
        ['recordValue', RawBytes]
    ]);

    constructor(values) {
        // TODO handle undefineds
        for (const [attr, _] of this.constructor.schema.fields) {
            this[attr] = values[attr]
        }
    }

    static deserialize(buffer) {
        const { value } = this.schema.deserialize(buffer);
        value.recordValue = metaDataRecordTypes[value.recordType]
            .deserialize(value.recordValue)
            .value;
        return new RecordValue(value);
    }

    serialize() {
        return this.constructor.schema.serialize({
            ...this,
            recordValue: metaDataRecordTypes[this.recordType]
                .serialize(this.recordValue)
        });
    }
}
