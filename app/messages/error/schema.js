import { Int16Field, StructField } from "../../serializer.js";

export class ErrorResponse {
    schema = new StructField([
        ['errorCode', Int16Field],
    ]);

    constructor(values) {
        this.values = values;
    }

    serialize() {
        return this.schema.serialize(this.values)
    }
}
