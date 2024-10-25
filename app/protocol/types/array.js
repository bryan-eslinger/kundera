import Int32 from "./int32.js";

// TODO: null arrays get -1 length field
export default class Array {
    constructor(elementType) {
        this.elementType = elementType;
    }

    serialize(value) {
        return Buffer.concat([
            Int32.serialize(value.length),
            ...value.map(this.elementType.serialize.bind(this.elementType))  
        ])
    }

    deserialize(buffer, offset) {
        const {
            value: length,
            size: lengthSize
        } = Int32.deserialize(buffer, offset);

        let elementOffset = offset + lengthSize;
        const value = [];

        for(let i = 0; i < length; i++) {
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
