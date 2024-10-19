import apiKeys from "./api_keys.js";
import { errorCodes } from "./error.js";
import { ArrayField, Int16Field, Int32Field, NullByteField, StructField } from "./serializer.js";

export class ErrorOnlyBody {
    constructor(errorCode) {
        this.errorCode = new Int16Field(errorCode);
        this.size = 2;
    }

    serializeInto(buffer, offset) {
        this.errorCode.serializeInto(buffer, offset);
    }
}

export class ApiVersionsBody {
    // TODO does this stuff want to be read in from config?
    constructor() {
        this.errorCode = new Int16Field(errorCodes.NO_ERROR);
        this.apiKeys = new ArrayField(
            [{
                apiKey: apiKeys.API_VERSIONS,
                minVersion: 0,
                maxVersion: 4
            }, {
                apiKey: apiKeys.HEARTBEAT,
                minVersion: 0,
                maxVersion: 4
            }],
            new StructField(
                {},
                ['apiKey', 'minVersion', 'maxVersion'],
                [Int16Field, Int16Field, Int16Field]
            )
        );
        this.nullByte = new NullByteField();
        this.throttleTime = new Int32Field(0);

        this.size = 11 + this.apiKeys.elements.length * 6;
    }

    serializeInto(buffer, offset) {
        let fieldOffset = offset;
        this.errorCode.serializeInto(buffer, offset);
        fieldOffset += this.errorCode.size;
        this.apiKeys.serializeInto(buffer, fieldOffset);
        fieldOffset += this.apiKeys.size;
        this.nullByte.serializeInto(buffer, fieldOffset);
        fieldOffset += this.nullByte.size;
        this.throttleTime.serializeInto(buffer, fieldOffset);
        fieldOffset += this.throttleTime.size;
        this.nullByte.serializeInto(buffer, fieldOffset);
    }
}
