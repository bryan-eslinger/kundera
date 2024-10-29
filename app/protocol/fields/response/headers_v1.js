import Int32Field from "../../types/int32.js";
import StructField from "../../types/struct.js";
import TaggedFields from "../tagged_fields.js";

export default class HeadersV1 {
    static schema = new StructField([
        ['correlationId', Int32Field],
        ['_taggedFields', TaggedFields],
    ]);

    constructor(values) {
        this.values = Object.assign({ _taggedFields: {} }, values)
    }

    serialize() {
        console.debug('Response headers');
        console.debug(this.values);
        return HeadersV1.schema.serialize(this.values);
    }

    static deserialize(buffer, offset) {
        return this.schema.deserialize(buffer, offset)
    }
}
