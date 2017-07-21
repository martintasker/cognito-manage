'use strict';

var AWS = require('aws-sdk');

var config = require('./config/config');
var settings = require('./lib/settings');

AWS.config.region = config.region;

var cognitoIdentity = new AWS.CognitoIdentity();
var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

var parser = new(require('argparse').ArgumentParser)();
parser.addArgument(['-u', '--user'], {
  required: true
});
parser.addArgument(['-e', '--email'], {
  required: true
});
var args = parser.parseArgs();

Promise.resolve()
.then(addUser)
.catch(function(reason) {
  console.error("problem: %j", reason);
});

function addUser() {
  const params = {
    UserPoolId: settings.get('userPoolId'),
    Username: args.user,
    DesiredDeliveryMediums: ['EMAIL'],
    ForceAliasCreation: true,
    UserAttributes: [{
      Name: 'email',
      Value: args.email
    },{
      Name: 'email_verified',
      Value: 'true'
    }],
  };
  return cognitoIdentityServiceProvider.adminCreateUser(params).promise()
  .then(data => {
    console.log("adminCreateUser -> %j", data);
    return data;
  });
}
