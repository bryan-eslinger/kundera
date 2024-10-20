import {
    BooleanField,
    CompactArrayField,
    CompactNullableStringField,
    CompactStringField,
    Int16Field,
    Int32Field,
    NullableStructField,
    StructField,
    TaggedFields,
    UuidField,
} from "../../serializer.js";

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
                ['replicaNodes', Int32Field],
                ['isrNodes', Int32Field],
                ['eligibleLeaderReplicas', Int32Field],
                ['lastKnownElr', Int32Field],
                ['offlineReplicas', Int32Field],
                ['_taggedField', TaggedFields],
            ]))],
            ['topicAuthorizedOperations', Int32Field],
            ['_taggedField', TaggedFields],
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