import Int32Field from "../../protocol/types/int32.js";
import Int64Field from "../../protocol/types/int64.js";
import StructField from "../../protocol/types/struct.js";
import TaggedFields from "../../protocol/fields/tagged_fields.js";
import CompactArrayField from "../../protocol/types/compact_array.js";
import UuidField from "../../protocol/types/uuid.js";
import CompactStringField from "../../protocol/types/compact_string.js";

  export default class FetchRequest {
    schema = new StructField([
        ['maxWaitMs', Int32Field],
        ['minBytes', Int32Field],
        ['maxBytes', Int32Field],
        ['isolationLevel', Int32Field],
        ['sessionId', Int32Field],
        ['topics', new CompactArrayField(new StructField([
            ['topicId', UuidField],
            ['partitions', new CompactArrayField(new StructField([
                ['partition', Int32Field],
                ['currentLeaderEpoch', Int32Field],
                ['fetchOffset', Int64Field],
                ['lastFetchedEpoch', Int32Field],
                ['logStartOffset', Int64Field],
                ['partitionMaxBytes', Int32Field],
                ['_taggedFields', TaggedFields],
            ]))],
            ['_taggedField', TaggedFields],
        ]))],
        ['forgottenTopicsData', new CompactArrayField(new StructField([
            ['topicId', UuidField],
            ['partitions', new CompactArrayField(Int32Field)],
            ['_taggedFields', TaggedFields],
        ]))],
        ['rackId', CompactStringField],
        ['_taggedFields', TaggedFields]
    ]);

    deserialize(buffer, offset) {
        return this.schema.deserialize(buffer, offset).value;
    }
}
