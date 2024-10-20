import {
    CompactStringField,
    StructField,
    TaggedFields
} from "../../serializer.js";

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