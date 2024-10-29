import CompactArray from "../../protocol/types/compact_array.js";
import CompactNullableString from "../../protocol/types/compact_nullable_string.js";
import CompactRecords from "../../protocol/types/compact_records.js";
import CompactString from "../../protocol/types/compact_string.js";
import Int16 from "../../protocol/types/int16.js";
import Int32 from "../../protocol/types/int32.js";
import Struct from "../../protocol/types/struct.js";
import TaggedFields from "../../protocol/fields/tagged_fields.js";

export default class ProduceRequest {
    schema = new Struct([
        ['transactionalId', CompactNullableString],
        ['acks', Int16],
        ['timeoutMs', Int32],
        ['topicData', new CompactArray(new Struct([
            ['name', CompactString],
            ['partitionData', new CompactArray(new Struct([
                ['index', Int32],
                ['records', CompactRecords],
                ['_taggedFields', TaggedFields]
            ]))],
            ['_taggedFields', TaggedFields]
        ]))],
        ['_taggedFields', TaggedFields]
    ]);

    constructor(values) {
        if (!!values) { 
            for (const [attr, _] of this.schema.fields) {
                this[attr] = values[attr];
            }
        }
    }

    deserialize(buffer, offset) {
        return this.schema.deserialize(buffer, offset).value;
    }

    serialize() {
        return this.schema.serialize(this);
    }
}
