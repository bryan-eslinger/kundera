export default class Uuid {
    static size = 16;

    static byteToHex = [...Array(256).keys()].map(i => (i + 0x100).toString(16).slice(1));

    static deserialize(buffer, offset = 0) {
        console.debug(`deserialized Uuid bytes ${offset} to ${offset + this.size - 1}`)

        return { 
            value: (
                this.byteToHex[buffer.readUInt8(offset)] +
                this.byteToHex[buffer.readUInt8(offset + 1)] +
                this.byteToHex[buffer.readUInt8(offset + 2)] +
                this.byteToHex[buffer.readUInt8(offset + 3)] +
                '-' +
                this.byteToHex[buffer.readUInt8(offset + 4)] +
                this.byteToHex[buffer.readUInt8(offset + 5)] +
                '-' +
                this.byteToHex[buffer.readUInt8(offset + 6)] +
                this.byteToHex[buffer.readUInt8(offset + 7)] +
                '-' +
                this.byteToHex[buffer.readUInt8(offset + 8)] +
                this.byteToHex[buffer.readUInt8(offset + 9)] +
                '-' +
                this.byteToHex[buffer.readUInt8(offset + 10)] +
                this.byteToHex[buffer.readUInt8(offset + 11)] +
                this.byteToHex[buffer.readUInt8(offset + 12)] +
                this.byteToHex[buffer.readUInt8(offset + 13)] +
                this.byteToHex[buffer.readUInt8(offset + 14)] +
                this.byteToHex[buffer.readUInt8(offset + 15)]
            ).toLowerCase(),
            size: this.size
        }
    }

    static serialize(value) {
        // TODO validation
        let v;
        return Buffer.from([
            (v = parseInt(value.slice(0, 8), 16)) >>> 24,
            (v >>> 16) & 0xff,
            (v >>> 8) & 0xff,
            v & 0xff,
        
            // Parse ........-####-....-....-............
            (v = parseInt(value.slice(9, 13), 16)) >>> 8,
            v & 0xff,
        
            // Parse ........-....-####-....-............
            (v = parseInt(value.slice(14, 18), 16)) >>> 8,
            v & 0xff,
        
            // Parse ........-....-....-####-............
            (v = parseInt(value.slice(19, 23), 16)) >>> 8,
            v & 0xff,
        
            // Parse ........-....-....-....-############
            // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
            ((v = parseInt(value.slice(24, 36), 16)) / 0x10000000000) & 0xff,
            (v / 0x100000000) & 0xff,
            (v >>> 24) & 0xff,
            (v >>> 16) & 0xff,
            (v >>> 8) & 0xff,
            v & 0xff
        ]);
    }
}
