import CompactStringField from "../protocol/types/compact_string.js";
import StructField from "../protocol/types/struct.js";
import UuidField from "../protocol/types/uuid.js";

export default class TopicRecord {
    static deserialize(buffer, offset) {
        const deserialized = this.schema.deserialize(buffer, offset);
        return deserialized;
    }
}

TopicRecord.schema = new StructField([
    ['name', CompactStringField],
    ['topicId', UuidField],
]);
