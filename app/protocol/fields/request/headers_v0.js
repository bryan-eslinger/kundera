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
    values = null;

    constructor(values) {
        this.size = null;
        // TODO update this class to be in line with the other Schema'd classes
        // i.e. static deserialize that returns an instance, then get rid of this if
        if (!!values) {
            this.values = {};
            for (const [attr, _] of this.schema.fields) {
                this.values[attr] = values[attr];
            };
        }
    }

    serialize() {
        return this.schema.serialize(this.values);
    }

    deserialize(buffer, offset) {
        const { value, size } = this.schema.deserialize(buffer, offset);
        this.size = size;
        return value;
    }
}
