import ArrayType from "../types/array.js";
import Int32 from "../types/int32.js";
import Int64 from "../types/int64.js";
import Int16 from "../types/int16.js";
import Int8 from "../types/int8.js";
import Records from "../types/records.js";
import Struct from "../types/struct.js";

export const RecordBatchHeader = new Struct([
    ['baseOffset', Int64],
    ['batchLength', Int32],
]);

const OFFSET_SIZE = Int64.size
const HEADER_SIZE = OFFSET_SIZE + Int32.size;

export const RecordBatchBody = new Struct([
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
    ['records', new ArrayType(Records)],
]);

const schema = new Struct([
    ...RecordBatchHeader.fields,
    ...RecordBatchBody.fields
]);

export default class RecordBatch {
    constructor(values) {
        for (const [attr, _] of schema.fields) {
            this[attr] = values[attr];
        }
    }

    static deserialize(buffer, offset) {
        // TODO handle malformed logs?
        const batchLength = buffer.readInt32BE(offset + OFFSET_SIZE);
        return {
            value: new RecordBatch(schema.deserialize(
                buffer.subarray(offset, offset + batchLength + HEADER_SIZE)
            ).value),
            size: batchLength + HEADER_SIZE
        }        
    }

    serialize() {
        const body = RecordBatchBody.serialize({ ...this, lastOffsetDelta: this.records.length });
        const header = RecordBatchHeader.serialize({
            batchLength: body.length,
            baseOffset: 0 // TODO offset management
        });
        return Buffer.concat([header, body]);
    }
}
