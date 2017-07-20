'use strict';

var AWS = require('aws-sdk');

var config = require('./lib/config');
var settings = require('./lib/settings');

AWS.config.region = config.region;

const cognitoIdentity = new AWS.CognitoIdentity();
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

Promise.resolve()
.then(queryIdentityPoolRoles)
.then(queryUsers)
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
