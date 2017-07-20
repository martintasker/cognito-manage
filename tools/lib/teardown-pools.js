'use strict';

'HANDLE WITH CARE!!';

var AWS = require('aws-sdk');

var config = require('./config');
var settings = require('./settings');

AWS.config.region = config.region;

var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
var cognitoIdentity = new AWS.CognitoIdentity();
var amazonIAM = new AWS.IAM();

function teardownPools() {
  return Promise.resolve()
    // remove roles
    .then(() => deleteRole(config.unauthRoleName))
    .then(() => deleteRole(config.authRoleName))
    // remove pools
    .then(() => deleteIdentityPool(settings.get('identityPoolId')))
    .then(() => deleteUserPoolClient(settings.get('userPoolId'), settings.get('applicationId')))
    .then(() => deleteUserPool(settings.get('userPoolId')))
  ;
}

function deleteUserPool(userPoolId) {
  console.log("deleteUserPool", userPoolId);
  const params = {
    UserPoolId: userPoolId
  };
  return cognitoIdentityServiceProvider.deleteUserPool(params).promise()
  .then(data => {
    console.log("deleteUserPool -> %j", data);
    return data;
  });
}

function deleteUserPoolClient(userPoolId, userPoolClientId) {
  console.log("deleteUserPoolClient", userPoolClientId);
  const params = {
    UserPoolId: userPoolId,
    ClientId: userPoolClientId,
  };
  return cognitoIdentityServiceProvider.deleteUserPoolClient(params).promise()
  .then(data => {
    console.log("deleteUserPoolClient -> %j", data);
    return data;
  });
}

function deleteIdentityPool(identityPoolId) {
  console.log("deleteIdentityPool", identityPoolId);
  const params = {
    IdentityPoolId: identityPoolId,
  };
  return cognitoIdentity.deleteIdentityPool(params).promise()
  .then(data => {
    console.log("deleteIdentityPool -> %j", data);
    return data;
  });
}

function deleteRole(roleName) {
  const params = {
    RoleName: roleName,
  };
  return amazonIAM.deleteRole(params).promise()
  .then(data => {
    console.log("deleteRole -> %j", data);
    return data;
  });
}

module.exports = teardownPools;
