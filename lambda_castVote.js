'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

const castVote = (payload, callback) => {
    if (typeof payload === "string"){
        payload = JSON.parse(payload);
    }
    
    var params = {
        Key: {
            singername: payload.vote
        },
        TableName: 'ssvoting',
            AttributeUpdates:{
                tally:{
                    Action: 'ADD',
                    Value: 1
                }
            }
    };
    
    console.log('Polling Vote:', JSON.stringify(params,null,2) );
    
    dynamo.updateItem(params,(err,data) => {
        if(err) console.log(err, err.stack);
        else console.log(data);
        
        callback(err,data);
    });
    
}


/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '204',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'POST':
            castVote(event.body, done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
