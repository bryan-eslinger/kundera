import CompactArrayField from "../../protocol/types/compact_array.js";
import CompactStringField from "../../protocol/types/compact_string.js";
import Int32Field from "../../protocol/types/int32.js";
import NullableStructField from "../../protocol/types/nullable_struct.js";
import StructField from "../../protocol/types/struct.js";
import TaggedFields from "../../protocol/fields/tagged_fields.js";

export default class DescribeTopicPartitionsRequest {
    schema = new StructField([
        ['topics', new CompactArrayField(
            new StructField([
                ['name', CompactStringField],
                ['_taggedFields', TaggedFields],
            ])
        )],
        ['responsePartitionLimit', Int32Field],
        ['cursor', new NullableStructField([
            ['topicName', CompactStringField],
            ['partitionIndex', Int32Field],
            ['_taggedFields', TaggedFields],
        ])],
        ['_taggedFields', TaggedFields]
    ]);

    deserialize(buffer, offset) {
        return this.schema.deserialize(buffer, offset).value;
    }
}
