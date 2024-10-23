import CompactArrayField from "../../protocol/types/compact_array.js";
import Int16Field from "../../protocol/types/int16.js";
import Int32Field from "../../protocol/types/int32.js";
import Int64Field from "../../protocol/types/int64.js";
import StructField from "../../protocol/types/struct.js";
import TaggedFields from "../../protocol/fields/tagged_fields.js";
import UuidField from "../../protocol/types/uuid.js";
import CompactRecordsField from "../../protocol/types/compact_records.js";

export default class FetchResponse {
    schema = new StructField([
        ['throttleTimeMs', Int32Field],
        ['errorCode', Int16Field],
        ['sessionId', Int32Field],
        ['responses', new CompactArrayField(new StructField([
            ['topicId', UuidField],
            ['partitions', new CompactArrayField(new StructField([
                ['partitionIndex', Int32Field],
                ['errorCode', Int16Field],
                ['highWatermark', Int64Field],
                ['lastStableOffset', Int64Field],
                ['logStartOffset', Int64Field],
                ['abortedTransactions', new CompactArrayField(new StructField([
                    ['producerId', Int64Field],
                    ['firstOffset', Int64Field],
                    ['_taggedFields', TaggedFields],
                ]))],
                ['preferredReadReplica', Int32Field],
                ['records', CompactRecordsField],
                ['_taggedFields', TaggedFields]
            ]))],
            ['_taggedFields', TaggedFields],
        ]))],
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
