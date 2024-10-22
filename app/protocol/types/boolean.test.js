import Boolean from "./boolean.js"

describe('Boolean', () => {
    const TRUE_BUFFER = Buffer.alloc(1, 1);
    const FALSE_BUFFER = Buffer.alloc(1);

    describe('serialize', () => {        
        it('handles truthy values', () => {
            expect(Boolean.serialize(true)).toEqual(TRUE_BUFFER);
            expect(Boolean.serialize(1)).toEqual(TRUE_BUFFER);
            expect(Boolean.serialize('true')).toEqual(TRUE_BUFFER);
            expect(Boolean.serialize('false')).toEqual(TRUE_BUFFER);
        });
        
        it('handles falsey values', () => {
            expect(Boolean.serialize(false)).toEqual(FALSE_BUFFER);
            expect(Boolean.serialize(0)).toEqual(FALSE_BUFFER);
            expect(Boolean.serialize(null)).toEqual(FALSE_BUFFER);
        });
        
    });

    describe('deserialize', () => {
        it('has a size key to report 1 byte decoded from the buffer', () => {
            expect(Boolean.deserialize(TRUE_BUFFER).size).toBe(1);
        });

        it('converts 1 to true', () => {
            expect(Boolean.deserialize(TRUE_BUFFER).value).toBe(true);
        });

        it('converts 0 to false', () => {
            expect(Boolean.deserialize(FALSE_BUFFER).value).toBe(false);
        });

        it('skips the first `offset` bytes', () => {
            const offset = 4;
            const buffer = Buffer.concat([Buffer.alloc(offset), TRUE_BUFFER]);
            expect(Boolean.deserialize(buffer, offset).value).toBe(true);
        });
    });
});
