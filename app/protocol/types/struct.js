export default class Struct {
    constructor(fields) {
        this.fields = new Map();
        for (const [attr, field] of fields) {
            this.fields.set(attr, field)
        }
    }

    // TODO strict or non-strict options re: fields in value not present in the schema
    serialize(value) {
        const fields = [];
        for (const [attr, field] of this.fields) {
            fields.push(field.serialize(value[attr]));
        }
        return Buffer.concat(fields);
    }

    deserialize(buffer, offset = 0) {
        const value = {};
        let fieldOffset = offset;
        for (const [attr, field] of this.fields) {
            console.debug(attr)
            const { value: fieldValue, size } = field.deserialize(buffer, fieldOffset);
            value[attr] = fieldValue;
            fieldOffset += size;
        }
        return { value, size: fieldOffset - offset }
    }
}
