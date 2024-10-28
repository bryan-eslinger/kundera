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
        it('converts the integer 75 to a zig-zagged var int byte array', () => {
            expect(VarInt.serialize(75)).toEqual(Buffer.from([0x96, 0x01]));
        });

        it('converts the integer 300 to a zig-zagged var int byte array', () => {
            expect(VarInt.serialize(300)).toEqual(Buffer.from([0xd8, 0x04]));
        });

        it('converts the integer 128 to a zig-zagged var int byte array', () => {
            expect(VarInt.serialize(128)).toEqual(Buffer.from([128, 2]))
        })
        
        it('converts the integer 513 to a zig-zagged var int byte array', () => {
            expect(VarInt.serialize(513)).toEqual(Buffer.from([130, 8]))
        })

        it('converts the integer 1025 to a zig-zagged var int byte array', () => {
            expect(VarInt.serialize(1025)).toEqual(Buffer.from([130, 16]))
        })
    });
});
