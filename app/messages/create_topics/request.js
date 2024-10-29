import TaggedFields from "../../protocol/fields/tagged_fields.js";
import BooleanType from "../../protocol/types/boolean.js";
import CompactArray from "../../protocol/types/compact_array.js";
import CompactNullableString from "../../protocol/types/compact_nullable_string.js";
import CompactString from "../../protocol/types/compact_string.js";
import Int16 from "../../protocol/types/int16.js";
import Int32 from "../../protocol/types/int32.js";
import Struct from "../../protocol/types/struct.js";

export default class CreateTopicsRequest {
    schema = new Struct([
        ['topics', new CompactArray(new Struct([
            ['name', CompactString],
            ['numPartitions', Int32],
            ['replicationFactor', Int16],
            ['assignments', new CompactArray(new Struct([
                ['partitionIndex', Int32],
                ['broker_ids', new CompactArray(Int32)],
                ['_taggedFields', TaggedFields]
            ]))],
            ['configs', new CompactArray(new Struct([
                ['name', CompactString],
                ['value', CompactNullableString],
                ['_taggedFields', TaggedFields],
            ]))],
            ['_taggedFields', TaggedFields],
        ]))],
        ['timeoutMs', Int32],
        ['validateOnly', BooleanType],
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
