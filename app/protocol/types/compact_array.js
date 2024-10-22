import UVarInt from './u_var_int.js';

// TODO: null arrays get -1 length field
export default class CompactArray {
    constructor(elementType) {
        this.elementType = elementType;
    }

    serialize(value) {
        return Buffer.concat([
            UVarInt.serialize(value.length + 1),
            ...value.map(this.elementType.serialize.bind(this.elementType))  
        ])
    }

    deserialize(buffer, offset) {
        const {
            value: length,
            size: lengthSize
        } = UVarInt.deserialize(buffer, offset);

        // console.log(`deserialized CompactArray length from bytes ${offset} to ${offset + lengthSize - 1}`)

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
