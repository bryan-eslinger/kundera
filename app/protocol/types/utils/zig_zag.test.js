import zigZag from "./zig_zag";

describe('zig zag encoding', () => {
    it('maps int -> positive ints alternating between negative and positive', () => {
        expect(zigZag.encode(-1)).toEqual(1);
        expect(zigZag.encode(1)).toEqual(2);
        expect(zigZag.encode(2)).toEqual(4);
    });

    it ('maps positive ints -> ints alternating between negative and positive', () => {
        expect(zigZag.decode(1)).toEqual(-1);
        expect(zigZag.decode(2)).toEqual(1);
        expect(zigZag.decode(4)).toEqual(2);
    });
});
