import apiVersionsConfig from "../../config/api_versions.js";
import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import ApiVersionsBody from "./schema.js";

const apiVersions = (_, res) => {
    res.headers(headerVersions.V0);

    res.send(new ApiVersionsBody({
        errorCode: errorCodes.NO_ERROR,
        apiKeys: apiVersionsConfig.map(apiVersion => ({...apiVersion, _taggedFields: [] })),
        // TODO set this on the response object based on actual server behavior
        throttleTimeMs: 0,
        _taggedFields: []
    }));
}

export default apiVersions;
