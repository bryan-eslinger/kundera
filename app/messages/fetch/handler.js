import { errorCodes } from "../../error.js";
import { headerVersions } from "../../protocol/fields/response/index.js";
import FetchResponse from "./schema.js";

const describeTopicPartitions = (req, res) => {
    res.headers(headerVersions.V1);

    res.send(new FetchResponse({
        throttleTimeMs: 0, // TODO take value from actual server behavior
        errorCode: errorCodes.NO_ERROR,
        sessionId: req.body.sessionId,
        responses: [],
    }))
}

export default describeTopicPartitions;
