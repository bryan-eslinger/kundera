const zigZag = {
    decode: byteValue => byteValue & 1 ? (byteValue + 1) / -2 : byteValue / 2,
    encode: (value) => value >= 0 ? value * 2 : value * -2 - 1
}

export default zigZag;
