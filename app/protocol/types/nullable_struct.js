import Nullable from "./utils/nullable.js";
import Struct from "./struct.js";

export default class NullableStruct {
    #nullable;

    constructor(fields) {
        this.#nullable = new Nullable(new Struct(fields), 0xff);
    }

    deserialize(buffer, offset = 0) {
        return this.#nullable.deserialize(buffer, offset);
    }

    serialize(value) {
        return this.#nullable.serialize(value);
    }
}
