import Int16Field from "../../protocol/types/int16.js";
import StructField from "../../protocol/types/struct.js";

export default class ErrorResponse {
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
