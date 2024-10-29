import Client from './index.js';
import CreateTopicsRequest from "../messages/create_topics/request.js";
import apiKeys from '../api_keys.js';
import MessageLengthField from '../protocol/fields/message_length.js';
import HeadersV1 from "../protocol/fields/response/headers_v1.js"
import CreateTopicsResponse from '../messages/create_topics/schema.js';

// TODO pluggable serializers
export default function create(topic) {
    const request = new CreateTopicsRequest({
        topics: [{
            name: topic,
            numPartitions: 1,
            replicationFactor: 1,
            assignments: [],
            configs: []
        }],
        timeoutMs: 0,
        validateOnly: false
    });

    const client = new Client();
    client.connect(() => {
        client
            .request(apiKeys.CREATE_TOPICS, 7, request.serialize())
            .then(data => {
                const { size: lengthSize } = MessageLengthField.deserialize(data);
                const { value: headers, size: headersSize } = HeadersV1.deserialize(data, lengthSize);
                const { value: resBody } = CreateTopicsResponse.deserialize(data, lengthSize + headersSize);
                console.log(headers);
                console.log(resBody);
            })
    })
}
