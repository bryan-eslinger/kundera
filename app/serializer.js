export class MessageLengthField {
    static serialize(length) {
        const buffer = Buffer.alloc(4);
        buffer.writeInt32BE(length);
        return buffer;
    }
}

export class Int16Field {
    static get size() {
        return 2;
    }

    static serialize(value) {
        const buffer = Buffer.alloc(this.size);
        buffer.writeInt16BE(value);
        return buffer;
    }

    static deserialize(buffer, offset) {
        return buffer.readInt16BE(offset);
    }
}

export class Int32Field {
    static get size() {
        return 4;
    }

    static serialize(value) {
        const buffer = Buffer.alloc(this.size);
        buffer.writeInt32BE(value);
        return buffer;
    }

    static deserialize(buffer, offset) {
        return buffer.readInt32BE(offset);
    }
}

export class UInt32Field {
    static get size() {
        return 4;
    }

    serialize(value) {
        const buffer = buffer.alloc(this.size);
        buffer.writeUInt32BE(value);
        return buffer;
    }
}

export class UVarIntField {
    // TODO: handle size calculations for VarInt*Fields
    static serialize(value) {
        const result = [];
        while (value > 127) {
            result.push((value & 127) | 128);
            value >>>= 7;
        }
        result.push(value);
        return Buffer.from(result);
    }

    // TODO: deserialize
}

export class StructField {
    constructor(fields) {
        this.fields = new Map();
        for (const [attr, field] of fields) {
            this.fields.set(attr, field)
        }
    }

    get size() {
        return this.fields.reduce((sum, [_, field]) => sum + field.size, 0);
    }

    serialize(value) {
        const fields = [];
        for (const [attr, field] of this.fields) {
            fields.push(field.serialize(value[attr]));
        }
        return Buffer.concat(fields);
    }

    deserialize(buffer, offset) {
        const value = {};
        let fieldOffset = offset;
        for (const [attr, field] of this.fields) {
            value[attr] = field.deserialize(buffer, fieldOffset);
            fieldOffset += field.size;
        }

        return value;
    }
}

// TODO: null arrays get -1 length field
export class ArrayField {
    constructor(elementType) {
        this.elementType = elementType;
    }

    // TODO size and deserialize
    serialize(value) {
        return Buffer.concat([
            Int32Field.serialize(value.length),
            ...value.map(this.elementType.serialize.bind(this.elementType))
        ])
    }
}

// TODO: null arrays get -1 length field
export class CompactArrayField {
    constructor(elementType) {
        this.elementType = elementType;
    }

    serialize(value) {
        return Buffer.concat([
            UVarIntField.serialize(value.length + 1),
            ...value.map(this.elementType.serialize.bind(this.elementType))  
        ])
    }
}

// TODO support tagged fields
export class TaggedFields {
    static serialize() {
        const buffer = Buffer.alloc(1);
        buffer.writeInt8(0);
        return buffer;
    }
}
