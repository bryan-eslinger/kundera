import {
    CompactArrayField,
    Int16Field,
    Int32Field,
    StructField,
    TaggedFields,
} from "../../serializer.js";

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
