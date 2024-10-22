import UVarInt from "./u_var_int";

describe('UVarInt', () => {
    // decimal 256 in the first 2 bytes
    const BYTE_ARRAY = Buffer.from([0x80, 0x02, 0x00])

    describe('deserialize', () => {
        it('converts the byte array to an integer', () => {
            expect(UVarInt.deserialize(BYTE_ARRAY).value).toEqual(256);
        });

        it('reports the appropriate size', () => {
            expect(UVarInt.deserialize(BYTE_ARRAY).size).toEqual(2);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 4;
            const paddedBuffer = Buffer.concat([Buffer.alloc(offset), BYTE_ARRAY]);
            expect(UVarInt.deserialize(paddedBuffer, offset).value).toEqual(256);
        });
    });

    describe('serialize', () => {
        it('converts the integer to a var int byte array', () => {
            expect(UVarInt.serialize(256)).toEqual(Buffer.from([0x80, 0x02]))
        });
    });
});
