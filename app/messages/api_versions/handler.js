import apiKeys from "../../api_keys.js";
import { errorCodes } from "../../error.js";
import { headerVersions } from "../../response.js";
import ApiVersionsBody from "./schema.js";

const apiVersions = (_, res) => {
    res.headers(headerVersions.V0);
    // TODO does this stuff want to be read in from config?
    res.send(new ApiVersionsBody({
        errorCode: errorCodes.NO_ERROR,
        apiKeys: [{
            apiKey: apiKeys.API_VERSIONS,
            minVersion: 0,
            maxVersion: 4,
            _taggedFields: [],
        }, {
            apiKey: apiKeys.DESCRIBE_TOPIC_PARTITIONS,
            minVersion: 0,
            maxVersion: 0,
            _taggedFields: [],
        }],
        // TODO set this on the response object based on actual server behavior
        throttleTimeMs: 0,
        _taggedFields: []
    }));
}

export default apiVersions;
