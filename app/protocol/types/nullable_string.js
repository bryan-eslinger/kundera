export default class NullableString {
    /*
    Represents a sequence of characters or null. 
    For non-null strings, first the length N is 
    given as an INT16. Then N bytes follow which 
    are the UTF-8 encoding of the character sequence.
    A null value is encoded with length of -1 and 
    there are no following bytes.
    */

    static deserialize(buffer, offset = 0) {
        const length = buffer.readInt16BE(offset);
        if (length === -1) {
            return { value: null, size: 2 }
        }
        return {
            value: buffer
                .subarray(offset + 2, offset + 2 + length)
                .toString(),
            size: length + 2
        }
    }

    static serialize(value) {
        if (value == null) {
            const buffer = Buffer.alloc(2);
            buffer.writeInt16BE(-1);
            return buffer;
        }

        const buffer = Buffer.alloc(value.length + 2);
        buffer.writeInt16BE(value.length)
        buffer.write(value, 2);
        return buffer;
    }
}
