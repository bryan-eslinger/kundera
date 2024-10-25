import ArrayType from "../protocol/types/array.js";
import CompactBytes from "../protocol/types/compact_bytes.js";
import Int32 from "../protocol/types/int32.js";
import Int64 from "../protocol/types/int64.js";
import Int16 from "../protocol/types/int16.js";
import Int8 from "../protocol/types/int8.js";
import Struct from "../protocol/types/struct.js";

export default class RecordBatch {
    static schema = new Struct([
        ['baseOffset', Int64],
        ['batchLength', Int32],
        ['partitionLeaderEpoch', Int32],
        ['magicByte', Int8],
        ['crc', Int32],
        ['attributes', Int16],
        ['lastOffsetDelta', Int32],
        ['baseTimestamp', Int64],
        ['maxTimestamp', Int64],
        ['producerId', Int64],
        ['producerEpoch', Int16],
        ['baseSequence', Int32],
        ['records', new ArrayType(CompactBytes)],
    ]);

    constructor(values) {
        // TODO handle undefineds
        for (const [attr, _] of this.constructor.schema.fields) {
            this[attr] = values[attr]
        }
    }

    static deserialize(buffer) {
        return new RecordBatch(this.schema.deserialize(buffer).value)
    }

    get #recordsLength() {
        return this.records.reduce((sum, record) => sum + record.length, 0);
    }

    serialize() {
        return RecordBatch.schema.serialize({
            ...this,
            ...{
                batchLength: 65 + this.#recordsLength,
                crc: 0, // TODO implement crc32 checksum,
                lastOffsetDelta: this.records.length - 1
            }
        });
    }
}