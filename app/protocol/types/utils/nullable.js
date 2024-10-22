export default class Nullable {
    nullByte;

    constructor(field, nullByte) {
        this.field = field;
        this.nullByte = nullByte;
    }

    deserialize(buffer, offset = 0) {
        if (buffer[offset] === this.nullByte) {
            console.log(`deserialized NullableStruct bytes ${offset} to ${offset}`)
            return { value: null, size: 1 }
        }
        return this.field.deserialize(buffer, offset);
    }

    serialize(value) {
        if (value == null) {
            return Buffer.from([this.nullByte]);
        }
        return this.field.serialize(value);
    }
}
