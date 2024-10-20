import {
    CompactArrayField,
    CompactStringField,
    Int32Field,
    NullableStructField,
    StructField,
    TaggedFields
} from "../../serializer.js";

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