import CompactArray from "../../protocol/types/compact_array.js";
import CompactNullableString from "../../protocol/types/compact_nullable_string.js";
import CompactString from "../../protocol/types/compact_string.js";
import Int16 from "../../protocol/types/int16.js";
import Int32 from "../../protocol/types/int32.js";
import Int64 from "../../protocol/types/int64.js";
import Struct from "../../protocol/types/struct.js";
import TaggedFields from "../../protocol/fields/tagged_fields.js";

export default class ProduceResponse {
    static schema = new Struct([
        ['responses', new CompactArray(new Struct([
            ['name', CompactString],
            ['partitionResponses', new CompactArray(new Struct([
                ['index', Int32],
                ['errorCode', Int16],
                ['baseOffset', Int64],
                ['logAppendTimeMs', Int64],
                ['logStartOffset', Int64],
                ['recordErrors', new CompactArray(new Struct([
                    ['batchIndex', Int32],
                    ['batchIndexErrorMessage', CompactNullableString],
                    ['_taggedFields', TaggedFields]
                ]))],
                ['errorMessage', CompactNullableString],
                ['_taggedFields', TaggedFields]
            ]))]
        ]))],
        ['throttleTimeMs', Int32],
        ['_taggedFields', TaggedFields],
    ]);

    // TODO extract into a ResponseSchema base class
    constructor(values) {
        this.values = values
    }

    serialize() {
        const serialized = ProduceResponse.schema.serialize(this.values);
        return serialized;
    }

    static deserialize(buffer, offset) {
        return this.schema.deserialize(buffer, offset);
    }
}
