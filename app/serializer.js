export class MessageLength {
    static serializeFor(message) {
        const buffer = Buffer.alloc(4);
        buffer.writeInt32BE(message.length);
        return buffer;
    }
}

export class NullByteField {
    serializeInto(buffer, offset) {
        buffer.writeInt16BE(0, offset);
        this.size = 2;
    }
}

export class Int16Field {
    constructor(value) {
        this.value = value
        this.size = 2;
    }

    serializeInto(buffer, offset) {
        buffer.writeInt16BE(this.value, offset);
    }

    deserialize(buffer, offset) {
        return buffer.readInt16BE(offset);
    }
}

export class Int32Field {
    constructor(value) {
        this.value = value;
        this.size = 4;
    }

    serializeInto(buffer, offset) {
        buffer.writeInt32BE(this.value, offset);
    }

    deserialize(buffer, offset) {
        return buffer.readInt32BE(offset);
    }
}

export class UInt32Field {
    constructor(value) {
        this.value = value;
        this.size = 4;
    }

    serializeInto(buffer, offset) {
        buffer.writeUInt32BE(this.value, offset);
    }
}

export class StructField {
    constructor(value, attributes, attributeTypes) {
        this.attributes = attributes;
        this.attributeTypes = attributeTypes;
        this.value = value;
    }

    get size() {
        return this.iterAttributes().reduce((sum, [_, field, __]) => sum + field.size, 0);
    }

    // TODO make this a generator
    iterAttributes() {
        let fieldOffset = 0;
        return this.attributeTypes.map((Type, idx) => {
            const field = new Type(this.value[this.attributes[idx]])
            const res = [this.attributes[idx], field, fieldOffset];
            fieldOffset += field.size;

            return res;
        });
    }

    serializeInto(buffer, offset) {
        for (const [_, field, fieldOffset] of this.iterAttributes()) {
            field.serializeInto(buffer, offset + fieldOffset)
        }
    }

    deserialize(buffer, offset) {
        for (const [attribute, field, fieldOffset] of this.iterAttributes()) {
            this.value[attribute] = field.deserialize(buffer, offset + fieldOffset)
        }

        return this.value;
    }

}

// TODO: null arrays get -1 length field
export class ArrayField {
    constructor(elements, elementType) {
        this.elementType = elementType;
        this.elements = elements;

        this.size = elements.length * elementType.size + 1;
    }

    serializeInto(buffer, offset) {
        buffer.writeUInt8(this.elements.length, offset);
        this.elements.forEach((element, idx) => {
            if (this.elementType instanceof StructField) {
                this.elementType.value = element;
                this.elementType.serializeInto(buffer, offset + 1 + idx * this.elementType.size);
            } else {
                element.serializeInto(buffer, offset + 1 + idx * this.elementType.size);
            }
        });
    }
}
