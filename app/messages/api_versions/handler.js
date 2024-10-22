import apiVersionsConfig from "../../config/api_versions.js";
import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import ApiVersionsBody from "./schema.js";

const apiVersions = (_, res) => {
    res.headers(headerVersions.V0);
    // TODO does this stuff want to be read in from config?
    res.send(new ApiVersionsBody({
        errorCode: errorCodes.NO_ERROR,
        apiKeys: apiVersionsConfig,
        // TODO set this on the response object based on actual server behavior
        throttleTimeMs: 0,
        _taggedFields: []
    }));
}

export default apiVersions;
