import CompactStringField from "../../protocol/types/compact_string.js";
import Int16Field from "../../protocol/types/int16.js";
import StructField from "../../protocol/types/struct.js";

export default class FeatureLevelRecord {
    static deserialize(buffer, offset) {
        const deserialized = this.schema.deserialize(buffer, offset);
        return deserialized;
    }

    static serialize(value) {
        return this.schema.serialize(value);
    }
}

FeatureLevelRecord.schema = new StructField([
    ['name', CompactStringField],
    ['featureLevel', Int16Field],
]);
