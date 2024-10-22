import BooleanField from "../../protocol/types/boolean.js";
import CompactArrayField from "../../protocol/types/compact_array.js";
import CompactNullableStringField from "../../protocol/types/compact_nullable_string.js";
import CompactStringField from "../../protocol/types/compact_string.js";
import Int16Field from "../../protocol/types/int16.js";
import Int32Field from "../../protocol/types/int32.js";
import NullableStructField from "../../protocol/types/nullable_struct.js";
import StructField from "../../protocol/types/struct.js";
import TaggedFields from "../../protocol/fields/tagged_fields.js";
import UuidField from "../../protocol/types/uuid.js";

export default class DescribeTopicPartitionsResponse {
    schema = new StructField([
        ['throttleTimeMs', Int32Field],
        ['topics', new CompactArrayField(new StructField([
            ['errorCode', Int16Field],
            ['name', CompactNullableStringField],
            ['topicId', UuidField],
            ['isInternal', BooleanField],
            ['partitions', new CompactArrayField(new StructField([
                ['errorCode', Int16Field],
                ['partitionIndex', Int32Field],
                ['leaderId', Int32Field],
                ['leaderEpoch', Int32Field],
                ['replicaNodes', new CompactArrayField(Int32Field)],
                ['isrNodes', new CompactArrayField(Int32Field)],
                ['eligibleLeaderReplicas', new CompactArrayField(Int32Field)],
                ['lastKnownElr', new CompactArrayField(Int32Field)],
                ['offlineReplicas', new CompactArrayField(Int32Field)],
                ['_taggedField', TaggedFields],
            ]))],
            ['topicAuthorizedOperations', Int32Field],
            ['_taggedFields', TaggedFields],
        ]))],
        ['nextCursor', new NullableStructField([
            ['topicName', CompactStringField],
            ['partitionIndex', Int32Field],
            ['_taggedField', TaggedFields],
        ])],
        ['_taggedFields', TaggedFields],
    ]);

    // TODO extract into a ResponseSchema base class
    constructor(values) {
        this.values = values
    }

    serialize() {
        const serialized = this.schema.serialize(this.values);
        return serialized;
    }
}
