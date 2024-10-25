import CompactArrayField from "../../protocol/types/compact_array.js";
import Int32Field from "../../protocol/types/int32.js";
import StructField from "../../protocol/types/struct.js"
import UuidField from "../../protocol/types/uuid.js";

export default class PartitionRecord {
    static deserialize(buffer, offset) {
        return this.schema.deserialize(buffer, offset);
    }

    static serialize(value) {
        return this.schema.serialize(value);
    }
}

PartitionRecord.schema = new StructField([
    ['partitionId', Int32Field],
    ['topicId', UuidField],
    ['replicas', new CompactArrayField(Int32Field)],
    ['isr', new CompactArrayField(Int32Field)],
    ['removingReplicas', new CompactArrayField(Int32Field)],
    ['addingReplicas', new CompactArrayField(Int32Field)],
    ['leader', Int32Field],
    // ['leaderRecoveryState', Int8Field],  // NOTE: listed in the kafka source, but absent from the binspec example
    ['leaderEpoch', Int32Field],
    ['partitionEpoch', Int32Field],
    ['directories', new CompactArrayField(UuidField)],
    ['eligibleLeaderReplicas', new CompactArrayField(Int32Field)],
    ['lastKnownElr', new CompactArrayField(Int32Field)],
]);
