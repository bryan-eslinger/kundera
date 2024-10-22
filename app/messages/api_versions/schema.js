import CompactArrayField from "../../protocol/types/compact_array.js";
import Int16Field from "../../protocol/types/int16.js";
import Int32Field from "../../protocol/types/int32.js";
import StructField from "../../protocol/types/struct.js";
import TaggedFields from "../../protocol/fields/tagged_fields.js";


export default class ApiVersionsResponse {
    schema = new StructField([
        ['errorCode', Int16Field],
        ['apiKeys', new CompactArrayField(
            new StructField([
                ['apiKey', Int16Field],
                ['minVersion', Int16Field],
                ['maxVersion', Int16Field],
                ['_taggedFields', TaggedFields]
            ])
        )],
        ['throttleTimeMs', Int32Field],
        ['_taggedFields', TaggedFields]
    ])

    constructor(values) {
        this.values = values
    }

    serialize() {
        return this.schema.serialize(this.values)
    }
}
