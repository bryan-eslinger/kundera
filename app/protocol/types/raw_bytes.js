export default class RawBytes {
    static deserialize(buffer, offset) {
        return {
            value: buffer.subarray(offset),
            size: buffer.length - offset
        }
    }

    static serialize(value) {
        return value;
    }
}
