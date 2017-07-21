'use strict';

var AWS = require('aws-sdk');

var config = require('./config/config');
var settings = require('./lib/settings');

AWS.config.region = config.region;

const cognitoIdentity = new AWS.CognitoIdentity();
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
const db = new AWS.DynamoDB();

Promise.resolve()
.then(queryIdentityPoolRoles)
.then(queryUsers)
.then(queryTables)
.catch(function(reason) {
  console.error("problem: %j", reason);
});

function queryIdentityPoolRoles() {
  const params = {
    IdentityPoolId: settings.get('identityPoolId'),
  };
  return cognitoIdentity.getIdentityPoolRoles(params).promise()
  .then(data => {
    console.log("queryIdentityPoolRoles -> %j", data);
    return data;
  });
}

function queryUsers() {
  const params = {
    UserPoolId: settings.get('userPoolId'),
    AttributesToGet: ['email'],
    PaginationToken: null // todo: scale up to support multiple queries using pagination tokens
  };
  return cognitoIdentityServiceProvider.listUsers(params).promise()
  .then(data => {
    console.log("listUsers -> %j", data);
    return data;
  });
}

function queryTables() {
  const tableNames = settings.get('tableNames');
  console.log("tables: %j", tableNames);
  return tableNames.reduce((inChain, tableName) => {
    return inChain
    .then(() => db.describeTable({TableName: tableName}).promise())
    .then(data => {
      console.log("describeTable -> %j", data);
    });
  }, Promise.resolve());
}
