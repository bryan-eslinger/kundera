import Uuid from "./uuid.js";

describe('Uuid', () => {
    const UUID_STRING = 'e392806d-b533-4810-ba03-0b43c49b60fc';
    const UUID_BYTE_ARRAY = Buffer.from([
        0xe3, 0x92, 0x80, 0x6d, 0xb5, 0x33, 0x48, 0x10,
        0xba, 0x03, 0x0b, 0x43, 0xc4, 0x9b, 0x60, 0xfc
    ]);
    
    describe('deserialize', () => {
        it('converts a byte array to a string', () => {
            expect(Uuid.deserialize(UUID_BYTE_ARRAY).value).toEqual(UUID_STRING);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 4;
            const paddedBuffer = Buffer.concat([Buffer.alloc(4), UUID_BYTE_ARRAY]);
            const deserialized = Uuid.deserialize(paddedBuffer, offset)
            expect(deserialized.value).toEqual(UUID_STRING);
        })

        it('has a size key with value 16', () => {
            expect(Uuid.deserialize(UUID_BYTE_ARRAY).size).toEqual(16);
        });
    });

    it('converts a valid uuid string to a byte-array length 16', () => {
        expect(Uuid.serialize(UUID_STRING)).toEqual(UUID_BYTE_ARRAY);
    });
});
