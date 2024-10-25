import BooleanType from "../../protocol/types/boolean.js";
import CompactArray from "../../protocol/types/compact_array.js";
import CompactNullableString from "../../protocol/types/compact_nullable_string.js";
import CompactString from "../../protocol/types/compact_string.js";
import Int8 from "../../protocol/types/int8.js"
import Int16 from "../../protocol/types/int16.js";
import Int32 from "../../protocol/types/int32.js";
import Struct from "../../protocol/types/struct.js";
import TaggedFields from "../../protocol/fields/tagged_fields.js";
import Uuid from "../../protocol/types/uuid.js";

export default class CreateTopicsResponse {
    schema = new Struct([
        ['throttleTimeMs', Int32],
        ['topics', new CompactArray(new Struct([
            ['name', CompactString],
            ['topicId', Uuid],
            ['errorCode', Int16],
            ['errorMessage', CompactNullableString],
            ['numPartitions', Int32],
            ['replicationFactor', Int16],
            ['configs', new CompactArray(new Struct([
                ['name', CompactString],
                ['value', CompactNullableString],
                ['readOnly', BooleanType],
                ['configSource', Int8],
                ['isSensitive', BooleanType],
                ['_taggedFields', TaggedFields]
            ]))]
        ]))],
        ['_taggedFields', TaggedFields],
    ]);

    // TODO extract into a ResponseSchema base class
    constructor(values) {
        this.values = values
    }

    serialize() {
        const serialized = this.schema.serialize(this.values);
        return serialized;
    }
}
