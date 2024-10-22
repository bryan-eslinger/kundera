import apiKeys from "../api_keys.js";

const apiVersions = [{
    apiKey: apiKeys.FETCH,
    minVersion: 0,
    maxVersion: 16,
},{
    apiKey: apiKeys.API_VERSIONS,
    minVersion: 0,
    maxVersion: 4,
    _taggedFields: [],
}, {
    apiKey: apiKeys.DESCRIBE_TOPIC_PARTITIONS,
    minVersion: 0,
    maxVersion: 0,
    _taggedFields: [],
}]

export const getApiVersionByKey = (key) => (
    apiVersions.filter(version => version.apiKey === key)[0]
);

export default apiVersions;
