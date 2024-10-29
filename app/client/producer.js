import { v4 as uuidv4} from 'uuid';

import Client from './index.js';
import ProduceRequest from "../messages/produce/request.js";
import apiKeys from '../api_keys.js';
import { RecordBatchBody } from '../protocol/fields/record_batch.js';
import HeadersV1 from "../protocol/fields/response/headers_v1.js"
import ProduceResponse from '../messages/produce/schema.js';
import MessageLengthField from '../protocol/fields/message_length.js';

// TODO pluggable serializers
// TODO key generation options
// TODO record batching
export default function produce(topic, message, _key) {
    const transactionalId = uuidv4();

    const records = RecordBatchBody.serialize({
        partitionLeaderEpoch: 9, // TODO is this the producer's responsibility?
        magicByte: 0,
        crc: 0, // TODO checksum
        attributes: 0,
        baseTimestamp: 0,
        maxTimestamp: 0,
        producerId: 1,
        producerEpoch: -1,
        baseSequence: 0,
        records: [Buffer.from(JSON.stringify(message))]
    })

    const request = new ProduceRequest({
        transactionalId,
        acks: 0, // TODO implement
        timeoutMs: 0, // TODO implement
        topicData: [{
            name: topic,
            partitionData: [{
                index: 0, // TODO implement
                records
            }]
        }]
    });

    const client = new Client();
    const serialized = request.serialize();
    client.connect(() => {
        client
            .request(apiKeys.PRODUCE, 11, serialized)
            .then(data => {
                const { size: lengthSize } = MessageLengthField.deserialize(data);
                const { value: headers, size: headersSize } = HeadersV1.deserialize(data, lengthSize);
                const { value: resBody } = ProduceResponse.deserialize(data, lengthSize + headersSize);
                console.log(headers);
                console.log(resBody);
            });
    })
}
