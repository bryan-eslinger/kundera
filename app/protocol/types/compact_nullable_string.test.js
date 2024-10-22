import CompactNullableString from "./compact_nullable_string.js";

describe('CompactNullableString', () => {
    const NON_NULL_STRING_BYTE_ARRAY = Buffer.from([0x04, 0x66, 0x6f, 0x6f]);
    const NON_NULL_STRING = 'foo';

    describe('deserialize', () => {
        it('reports the size as the total of the length byte(s) and the string bytes', () => {
            const deserialized = CompactNullableString.deserialize(NON_NULL_STRING_BYTE_ARRAY);
            expect(deserialized.size).toEqual(4);
        });

        it('reads a string of length N where the first bytes are N+1 as an unsigned var int', () => {
            const deserialized = CompactNullableString.deserialize(NON_NULL_STRING_BYTE_ARRAY);
            expect(deserialized.value).toEqual(NON_NULL_STRING);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 12;
            const paddedBuffer = Buffer.concat([Buffer.alloc(12), NON_NULL_STRING_BYTE_ARRAY]);
            const deserialized = CompactNullableString.deserialize(paddedBuffer, offset);
            expect(deserialized.value).toEqual(NON_NULL_STRING);
        });
    });

    it('converts a string to a byte array where the first bytes are the string length as unsigned varint followed by the string bytes', () => {
        const serialized = CompactNullableString.serialize(NON_NULL_STRING);
        expect(serialized).toEqual(NON_NULL_STRING_BYTE_ARRAY);
    });

    describe('accepts null', () => {
        const NULL_STRING_BYTE_ARRAY = Buffer.from([0x00]);

        describe('deserialize', () => {
            it('has a value of null', () => {
                const deserialized = CompactNullableString.deserialize(NULL_STRING_BYTE_ARRAY);
                expect(deserialized.value).toBe(null);
            });

            it('reports a byte size of 1', () => {
                const deserialized = CompactNullableString.deserialize(NULL_STRING_BYTE_ARRAY);
                expect(deserialized.size).toEqual(1);
            });
        });

        describe('serialize', () => {
            it('converts null to the single byte 0x00', () => {
                expect(CompactNullableString.serialize(null)).toEqual(NULL_STRING_BYTE_ARRAY);
            });

            it('converts undefined to the single byte 0x00', () => {
                expect(CompactNullableString.serialize(undefined)).toEqual(NULL_STRING_BYTE_ARRAY);
            });
        });
    });
});
