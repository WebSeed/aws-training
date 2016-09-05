const AWS = require('aws-sdk');
const co = require('co');

AWS.config.update({
  accessKeyId: 'akid',
  secretAccessKey: 'secret',
  region: 'us-west-1',
});

const INFECTIONS_TABLE = '';

co(function* main() {
  const dynamodb = new AWS.DynamoDB();

  yield dynamodb.createTable({
    AttributeDefinitions: [{
      AttributeName: 'PatientId',
      AttributeType: 'S',
    }, {
      AttributeName: 'City',
      AttributeType: 'S',
    }, {
      AttributeName: 'Date',
      AttributeType: 'S',
    }],
    KeySchema: [{
      AttributeName: 'PatientId',
      KeyType: 'HASH',
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 10,
    },
    TableName: INFECTIONS_TABLE,
    GlobalSecondaryIndexes: [{
      IndexName: 'CITY_DATE_INDEX_NAME',
      KeySchema: [{
        AttributeName: 'City',
        KeyType: 'HASH',
      }, {
        AttributeName: 'Date',
        KeyType: 'RANGE',
      }],
      Projection: {
        ProjectionType: 'ALL',
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 10,
      },
    }],
  }).promise();

  console.log('Process complete!');
}).catch(err => console.error(err));
