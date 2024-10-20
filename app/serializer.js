const NULL_BYTE = 0xff;

export class MessageLengthField {
    static serialize(length) {
        const buffer = Buffer.alloc(4);
        buffer.writeInt32BE(length);
        return buffer;
    }
}

export class BooleanField {
    static get size() {
        return 1
    }

    static serialize(value) {
        const buffer = Buffer.alloc(1);
        if (!!value) { buffer.writeInt8(1); }

        return buffer
    }
}

export class UuidField {
    static get size() {
        return 16
    }
    static serialize(_) {
        // TODO implement for real
        return Buffer.alloc(this.size);
    }
}

// TODO implement with Compactable and Nullable decorators on StringField
export class CompactNullableStringField {
    static serialize(value) {
        if (value === null) {
            return Buffer.alloc(1);
        }
        return Buffer.concat([
            UVarIntField.serialize(value.length + 1),
            Buffer.from(value)
        ]);
    }
}

// TODO implement with Compactable decorator on StringField
export class CompactStringField {
    /*
    Represents a sequence of characters. 
    First the length N + 1 is given as an
    UNSIGNED_VARINT . Then N bytes follow
    which are the UTF-8 encoding of the
    character sequence.
    */
    static deserialize(buffer, offset) {
        const {
            value: length,
            size: lengthSize
        } = UVarIntField.deserialize(buffer, offset);

        return {
            value: buffer
                .subarray(offset + lengthSize, offset + lengthSize + length - 1)
                .toString(),
            size: length - 1 + lengthSize
        }
    }

    static serialize(value) {
        return Buffer.concat([
            UVarIntField.serialize(value.length + 1),
            Buffer.from(value)
        ]);
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
        return { value: buffer.readInt16BE(offset), size: this.size }
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
        return { value: buffer.readInt32BE(offset), size: this.size }
    }
}

export class NullableStringField {
    /*
    Represents a sequence of characters or null. 
    For non-null strings, first the length N is 
    given as an INT16. Then N bytes follow which 
    are the UTF-8 encoding of the character sequence.
    A null value is encoded with length of -1 and 
    there are no following bytes.
    */

    static deserialize(buffer, offset) {
        const length = buffer.readInt16BE(offset);
        if (length === -1) {
            return { value: null, size: 1 }
        }
        return {
            value: buffer
                .subarray(offset + 2, offset + 2 + length)
                .toString(),
            size: length + 2
        }
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
    static serialize(value) {
        const result = [];
        while (value > 0x7f) {
            result.push((value & 0x7f) | 0x80);
            value >>>= 7;
        }
        result.push(value);
        return Buffer.from(result);
    }

    // TODO: deserialize
    static deserialize(buffer, offset) {
        let value = 0;
        let shift = 0;
        let size = offset;

        while (true) {
            const byte = buffer[size++];

            value |= (byte & 0x7f) << shift;
            shift += 7;

            if ((byte & 0x80) === 0) {
                return { value, size: size - offset };
            }
        }
    }
}

class Nullable {
    static deserialize(field, buffer, offset) {
        if (buffer[offset] === NULL_BYTE) {
            return { value: field.null, size: 1 }
        }
        return field.deserialize(buffer, offset);
    }

    static serialize(field, value) {
        if (!value || value == field.null) {
            return Buffer.from([NULL_BYTE]);
        }
        return field.serialize(value);
    }
}

export class NullableStructField {
    constructor(fields) {
        this.struct = new StructField(fields);
    }

    deserialize(buffer, offset) {
        return Nullable.deserialize(this.struct, buffer, offset);
    }

    serialize(value) {
        return Nullable.serialize(this.struct, value);
    }

}

export class StructField {
    null = {};

    constructor(fields) {
        this.fields = new Map();
        for (const [attr, field] of fields) {
            this.fields.set(attr, field)
        }
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
            const { value: fieldValue, size } = field.deserialize(buffer, fieldOffset);
            value[attr] = fieldValue;
            fieldOffset += size;
        }

        return { value, size: fieldOffset - offset }
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

    deserialize(buffer, offset) {
        const {
            value: length,
            size: lengthSize
        } = UVarIntField.deserialize(buffer, offset);

        let elementOffset = offset + lengthSize;
        const value = [];
        // length - 1 because it's compact
        for(let i = 0; i < length - 1; i++) {
            const {
                value: elValue,
                size: elSize
            } = this.elementType.deserialize(buffer, elementOffset);
            value.push(elValue);
            elementOffset += elSize;
        }
        return { value, size: elementOffset - offset }
    }
}

// TODO support tagged fields
export class TaggedFields {
    static serialize() {
        const buffer = Buffer.alloc(1);
        buffer.writeInt8(0);
        return buffer;
    }

    static deserialize(_buffer, _offset) {
        return { value: {}, size: 1 }
    }
}
