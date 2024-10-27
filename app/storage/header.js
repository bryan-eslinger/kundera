import CompactBytes from "../protocol/types/compact_bytes.js"
import CompactString from "../protocol/types/compact_string.js"
import Struct from "../protocol/types/struct.js"

export default class Header {
    static schema = new Struct([
        ['headerKey', CompactString],
        ['headerValue', CompactBytes]
    ]);
}
