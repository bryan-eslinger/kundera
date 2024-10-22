import CompactStringField from "../../protocol/types/compact_string.js";
import StructField from "../../protocol/types/struct.js";
import TaggedFields from "../../protocol/fields/tagged_fields.js";

export default class ApiVersionsRequest {
    schema = new StructField([
        ['clientSoftwareName', CompactStringField],
        ['clientSoftwareVersion', CompactStringField],
        ['_taggedFields', TaggedFields],
    ]);

    deserialize(buffer, offset) {
        return this.schema.deserialize(buffer, offset).value;
    }
}
