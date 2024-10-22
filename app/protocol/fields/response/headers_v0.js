import Int32Field from "../../types/int32.js";
import StructField from "../../types/struct.js";

export default class HeadersV0 {
    schema = new StructField([
        ['correlationId', Int32Field],
    ]);

    constructor(values) {
        this.values = Object.assign(values)
    }

    serialize() {
        console.debug('Response headers');
        console.debug(this.values);
        return this.schema.serialize(this.values);
    }
}
