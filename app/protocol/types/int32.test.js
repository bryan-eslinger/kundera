import Int32 from "./int32";

describe('Int32', () => {
    // as decimal ints: [73822063, 72222215]
    const BYTE_ARRAY = Buffer.from([0x04, 0x66, 0x6f, 0x6f, 0x04, 0x4e, 0x06, 0x07]);

    describe('deserialize', () => {
        it('reports the size as 4', () => {
            expect(Int32.deserialize(BYTE_ARRAY).size).toEqual(4);
        });

        it('reads the first byte and returns the value as a number, big-endian', () => {
            expect(Int32.deserialize(BYTE_ARRAY).value).toEqual(73822063);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 4;
            expect(Int32.deserialize(BYTE_ARRAY, offset).value).toEqual(72222215);
        });
    });

    it('converts a number to a byte array 4-byte long, big-endian', () => {
        expect(Int32.serialize(73822063)).toEqual(Buffer.from([0x04, 0x66, 0x6f, 0x6f]));
    });
});
