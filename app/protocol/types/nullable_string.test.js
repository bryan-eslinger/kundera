import NullableString from "./nullable_string";

describe('NullableString', () => {
    const NON_NULL_STRING_BYTE_ARRAY = Buffer.from([0x00, 0x03, 0x66, 0x6f, 0x6f]);
    const NON_NULL_STRING = 'foo';

    describe('deserialize', () => {
        it('reports the size as length of the string bytes + 2', () => {
            const deserialized = NullableString.deserialize(NON_NULL_STRING_BYTE_ARRAY);
            expect(deserialized.size).toEqual(5);
        });

        it('reads a string of length N where the first 2 bytes are N as an int16', () => {
            const deserialized = NullableString.deserialize(NON_NULL_STRING_BYTE_ARRAY);
            expect(deserialized.value).toEqual(NON_NULL_STRING);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 12;
            const paddedBuffer = Buffer.concat([Buffer.alloc(12), NON_NULL_STRING_BYTE_ARRAY]);
            const deserialized = NullableString.deserialize(paddedBuffer, offset);
            expect(deserialized.value).toEqual(NON_NULL_STRING);
        });
    });

    it('converts a string to a byte array where the first bytes are the string length as unsigned varint followed by the string bytes', () => {
        const serialized = NullableString.serialize(NON_NULL_STRING);
        expect(serialized).toEqual(NON_NULL_STRING_BYTE_ARRAY);
    });

    describe('accepts null', () => {
        const NULL_STRING_BYTE_ARRAY = Buffer.from([0xff, 0xff]);

        describe('deserialize', () => {
            it('has a value of null', () => {
                const deserialized = NullableString.deserialize(NULL_STRING_BYTE_ARRAY);
                expect(deserialized.value).toBe(null);
            });

            it('reports a byte size of 2', () => {
                const deserialized = NullableString.deserialize(NULL_STRING_BYTE_ARRAY);
                expect(deserialized.size).toEqual(2);
            });
        });

        describe('serialize', () => {
            it('converts null to the single byte 0xff', () => {
                expect(NullableString.serialize(null)).toEqual(NULL_STRING_BYTE_ARRAY);
            });

            it('converts undefined to the single byte 0xff', () => {
                expect(NullableString.serialize(undefined)).toEqual(NULL_STRING_BYTE_ARRAY);
            });
        });
    });
});
