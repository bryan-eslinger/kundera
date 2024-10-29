import apiKeys from "../api_keys.js";

const apiVersions = [{
    apiKey: apiKeys.CREATE_TOPICS,
    minVersion: 7,
    maxVersion: 7
}, {
    apiKey: apiKeys.FETCH,
    minVersion: 0,
    maxVersion: 16,
},{
    apiKey: apiKeys.API_VERSIONS,
    minVersion: 0,
    maxVersion: 4,
}, {
    apiKey: apiKeys.DESCRIBE_TOPIC_PARTITIONS,
    minVersion: 0,
    maxVersion: 0,
},
{
    apiKey: apiKeys.PRODUCE,
    minVersion: 11,
    maxVersion: 11,
}]

export const getApiVersionByKey = (key) => (
    apiVersions.filter(version => version.apiKey === key)[0]
);

export default apiVersions;
