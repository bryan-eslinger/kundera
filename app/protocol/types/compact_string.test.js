import CompactString from "./compact_string";

describe('CompactString', () => {
    const STRING_BYTE_ARRAY = Buffer.from([0x04, 0x66, 0x6f, 0x6f]);
    const STRING = 'foo';

    describe('deserialize', () => {
        it('reports the size as the total of the length byte(s) and the string bytes', () => {
            const deserialized = CompactString.deserialize(STRING_BYTE_ARRAY);
            expect(deserialized.size).toEqual(4);
        });

        it('reads a string of length N where the first bytes are N+1 as an unsigned var int', () => {
            const deserialized = CompactString.deserialize(STRING_BYTE_ARRAY);
            expect(deserialized.value).toEqual(STRING);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 12;
            const paddedBuffer = Buffer.concat([Buffer.alloc(12), STRING_BYTE_ARRAY]);
            const deserialized = CompactString.deserialize(paddedBuffer, offset);
            expect(deserialized.value).toEqual(STRING);
        });
    });

    it('converts a string to a byte array where the first bytes are the string length as unsigned varint followed by the string bytes', () => {
        const serialized = CompactString.serialize(STRING);
        expect(serialized).toEqual(STRING_BYTE_ARRAY);
    });
});
