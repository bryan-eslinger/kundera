import VarInt from "./var_int";

describe('VarInt', () => {
    // decimal 128 in the first 2 bytes (zig-zagged)
    const BYTE_ARRAY = Buffer.from([0x80, 0x02, 0x00])

    describe('deserialize', () => {
        it('converts the byte array to an integer', () => {
            expect(VarInt.deserialize(BYTE_ARRAY).value).toEqual(128);
        });

        it('reports the appropriate size', () => {
            expect(VarInt.deserialize(BYTE_ARRAY).size).toEqual(2);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 4;
            const paddedBuffer = Buffer.concat([Buffer.alloc(offset), BYTE_ARRAY]);
            expect(VarInt.deserialize(paddedBuffer, offset).value).toEqual(128);
        });
    });

    describe('serialize', () => {
        it('converts the integer to a zig-zagged var int byte array', () => {
            expect(VarInt.serialize(128)).toEqual(Buffer.from([0x80, 0x02]))
        });
    });
});
