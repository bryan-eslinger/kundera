// TODO support tagged fields
export default class TaggedFields {
    static serialize() {
        return Buffer.alloc(1);
    }

    static deserialize(_buffer, offset) {
        console.log(`deserialized taggedfields bytes ${offset} to ${offset}`)
        return { value: {}, size: 1 }
    }
}