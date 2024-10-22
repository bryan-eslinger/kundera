import Int64 from "./int64";

describe('Int64', () => {
    // as decimal ints: [73822063, 72222215]
    const BYTE_ARRAY = Buffer.from([
        0x00, 0x00, 0x00, 0x00, 0x04, 0x66, 0x6f, 0x6f,
        0x00, 0x00, 0x00, 0x00, 0x04, 0x4e, 0x06, 0x07
    ]);

    describe('deserialize', () => {
        it('reports the size as 8', () => {
            expect(Int64.deserialize(BYTE_ARRAY).size).toEqual(8);
        });

        it('reads the first byte and returns the value as a number, big-endian', () => {
            expect(Int64.deserialize(BYTE_ARRAY).value).toEqual(BigInt(73822063));
        });

        it('skips the first `offset` bytes', () => {
            const offset = 8;
            expect(Int64.deserialize(BYTE_ARRAY, offset).value).toEqual(BigInt(72222215));
        });
    });

    it('converts a number to a byte array 8-bytes long, big-endian', () => {
        expect(Int64.serialize(73822063)).toEqual(Buffer.from([0x00, 0x00, 0x00, 0x00, 0x04, 0x66, 0x6f, 0x6f]));
    });
});
