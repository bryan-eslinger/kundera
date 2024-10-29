import Client from './index.js';
import FetchRequest from "../messages/fetch/request.js";
import apiKeys from '../api_keys.js';
import HeadersV1 from "../protocol/fields/response/headers_v1.js"
import FetchResponse from '../messages/fetch/schema.js';
import MessageLengthField from '../protocol/fields/message_length.js';
import RecordBatch from '../protocol/fields/record_batch.js';

// TODO pluggable serializers
// TODO method signature that allows for multiple topics
// TODO (big todo in the client) -> introduce consumer group concept
// and allow individual client to consume a topic then be given
// partition assignments
export default function consume(topicId, fetchOffset = 0n) {
    const request = new FetchRequest().serialize({
        maxWaitMs: 0,
        minBytes: 0,
        maxBytes: 0,
        isolationLevel: 0,
        sessionId: 0,
        topics: [{
            topicId,
            partitions: [{
                partition: 0,
                currentLeaderEpoch: 0,
                fetchOffset,
                lastFetchedEpoch: 0,
                logStartOffset: 0,
                partitionMaxBytes: 0
            }]
        }],
        forgottenTopicsData: [],
        rackId: 'whatanicerack',
    });

    const client = new Client();
    client.connect(() => {
        client
            .request(apiKeys.FETCH, 16, request)
            .then(data => {
                const { size: lengthSize } = MessageLengthField.deserialize(data);
                const { size: headersSize } = HeadersV1.deserialize(data, lengthSize);
                const { value: resBody } = FetchResponse.deserialize(data, lengthSize + headersSize);
                console.log(resBody.responses[0].partitions[0].records.length)
                resBody.responses.forEach(response => {
                    response.partitions.forEach(partition => {
                        let offset = 0;
                        while (offset < partition.records.length) {
                            const { value, size } = RecordBatch.deserialize(partition.records, offset);
                            console.log(`Message offset ${value.baseOffset}`)
                            console.log(value.records.toString());
                            offset += size;
                        }
                    })
                });
            })
    })
}
