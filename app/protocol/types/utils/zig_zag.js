const zigZag = {
    decode: byteValue => (byteValue >>> 0x01) ^ -(byteValue & 0x01),
    encode: (value) => (value >> 0x07) ^ (value << 0x01) 
}

export default zigZag;
