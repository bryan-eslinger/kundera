import Int16 from "./int16";

describe('Int16', () => {
    // as decimal ints: [1126, 28527]
    const BYTE_ARRAY = Buffer.from([0x04, 0x66, 0x6f, 0x6f]);

    describe('deserialize', () => {
        it('reports the size as 2', () => {
            expect(Int16.deserialize(BYTE_ARRAY).size).toEqual(2);
        });

        it('reads the first byte and returns the value as a number, big-endian', () => {
            expect(Int16.deserialize(BYTE_ARRAY).value).toEqual(1126);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 2;
            expect(Int16.deserialize(BYTE_ARRAY, offset).value).toEqual(28527);
        });
    });

    it('converts a number to a byte array 2-byte long, big-endian', () => {
        expect(Int16.serialize(1126)).toEqual(Buffer.from([0x04, 0x66]));
    });
});
