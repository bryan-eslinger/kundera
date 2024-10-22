import { jest } from '@jest/globals';
import Nullable from "./nullable";

describe('Nullable', () => {
    const MockField = {
        deserialize: jest.fn(),
        serialize: jest.fn(),
    }

    const nullableField = new Nullable(MockField, 0xff);
    const NULL_BUFFER = Buffer.from([0xff]);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('deserialize', () => {
        describe('when given the configured null byte', () => {
            it('converts to the configured null value', () => {
                expect(nullableField.deserialize(NULL_BUFFER).value).toBe(null);
            });

            it('reports the size as 1', () => {
                expect(nullableField.deserialize(NULL_BUFFER).size).toEqual(1);
            });

            it('skips the first `offset` bytes', () => {
                const offset = 42;
                const paddedBuffer = Buffer.concat([Buffer.alloc(offset), NULL_BUFFER]);

                expect(nullableField.deserialize(paddedBuffer, offset).value).toBe(null);
            });
        });

        describe('when given a byte array with non-null bytes', () => {
            it('delegates to the underlying field', () => {
                const buffer = Buffer.from([0x01, 0x02])
                const offset = 42;
                nullableField.deserialize(buffer, offset);

                expect(MockField.deserialize).toHaveBeenCalledTimes(1);
                expect(MockField.deserialize).toHaveBeenCalledWith(buffer, 42);
            });
        });
    });

    describe('serialize', () => {
        describe('when given null', () => {
            it('converts to the configured null byte', () => {
                expect(nullableField.serialize(null)).toEqual(NULL_BUFFER);
            });
        });

        describe('when given a non-null value', () => {
            it('delegates to the underlying field', () => {
                nullableField.serialize(42);

                expect(MockField.serialize).toHaveBeenCalledTimes(1);
                expect(MockField.serialize).toHaveBeenCalledWith(42);
            });
        });
    });
});
