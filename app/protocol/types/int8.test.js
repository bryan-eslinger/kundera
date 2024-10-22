import Int8 from "./int8";

describe('Int8', () => {
    // as decimal ints: [4, 102, 111, 111]
    const BYTE_ARRAY = Buffer.from([0x04, 0x66, 0x6f, 0x6f]);

    describe('deserialize', () => {
        it('reports the size as 1', () => {
            expect(Int8.deserialize(BYTE_ARRAY).size).toEqual(1);
        });

        it('reads the first byte and returns the value as a number', () => {
            expect(Int8.deserialize(BYTE_ARRAY).value).toEqual(4);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 2;
            expect(Int8.deserialize(BYTE_ARRAY, offset).value).toEqual(111);
        });
    });

    it('converts a number to a byte array 1-byte long', () => {
        expect(Int8.serialize(4)).toEqual(Buffer.from([4]));
    });
});
