import Int16Field from "../../types/int16.js";
import Int32Field from "../../types/int32.js";
import NullableStringField from "../../types/nullable_string.js";
import StructField from "../../types/struct.js";
import TaggedFields from "../../fields/tagged_fields.js";

// TODO: need to work out handling multiple API versions cleanly
export default class HeadersV0 {
    schema = new StructField([
        ['requestApiKey', Int16Field],
        ['requestApiVersion', Int16Field],
        ['correlationId', Int32Field],
        ['clientId', NullableStringField],
        ['_taggedFields', TaggedFields]
    ]);

    constructor() {
        this.size = null;
    }

    deserialize(buffer, offset) {
        const { value, size } = this.schema.deserialize(buffer, offset);
        this.size = size;
        return value;
    }
}
