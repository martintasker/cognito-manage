'use strict';

var AWS = require('aws-sdk');

var config = require('./config');
var settings = require('./settings');

AWS.config.region = config.region;

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
const cognitoIdentity = new AWS.CognitoIdentity();
const amazonIAM = new AWS.IAM();

function setupPools() {
  return Promise.resolve()
  // create a user pool, a client app for it, and an identity pool for both of them
  .then(createUserPool)
  .then(createUserPoolClient)
  .then(createIdentityPool)
  // create auth role, then attach it to the identity pool
  .then(createAuthRole)
  .then(createUnauthRole)
  .then(attachRoles)
  ;
}

function createUserPool() {
  var params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPool-property
    PoolName: config.userPoolName,
    AliasAttributes: ['email'], // sign in with email ID: this is what cognito-auth supports currently; 'phone_number' is also interesting
    AutoVerifiedAttributes: ['email'], // AWS recommends this setting, if the corresponding AliasAttribute is used
    EmailVerificationSubject: config.confirmationEmailSubject,
    EmailVerificationMessage: config.confirmationEmailBody,
    LambdaConfig: {},
    MfaConfiguration: 'OFF', // more lifecycle hooks would be needed to support 'ON'
    Policies: {
      PasswordPolicy: { // feel free to configure
        MinimumLength: 8,
        RequireLowercase: true,
        RequireNumbers: true,
        RequireSymbols: false,
        RequireUppercase: false
      }
    },
  };
  return new Promise(function(resolve, reject) {
    cognitoIdentityServiceProvider.createUserPool(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      // console.log("createUserPool -> %j", data);
      console.log("createUserPool -> id:", data.UserPool.Id);
      settings.set('userPoolId', data.UserPool.Id);
      return resolve(data);
    });
  });
}

function createUserPoolClient() {
  var params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPoolClient-property
    // in AWS console-speak, this is an "application" for a user pool; in API-speak, it's a "client"
    ClientName: config.appName,
    UserPoolId: settings.get('userPoolId'),
    ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'], // todo: check whether we can move on now
    GenerateSecret: false, // by requirement, since we generate temporary secrets on the fly at login time
    ReadAttributes: ['email'], // see http://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
    RefreshTokenValidity: 0, // days, default 30; see http://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html
    WriteAttributes: [], // required for profile maintenance
  };
  return new Promise(function(resolve, reject) {
    cognitoIdentityServiceProvider.createUserPoolClient(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      console.log("createUserPoolClient -> %j", data);
      console.log("createUserPoolClient -> id:", data.UserPoolClient.ClientId);
      settings.set('applicationId', data.UserPoolClient.ClientId);
      return resolve(data);
    });
  });
}

function createIdentityPool() {
  var params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#createIdentityPool-property
    IdentityPoolName: config.poolName,
    CognitoIdentityProviders: [{
      ProviderName: 'cognito-idp.' + config.region + '.amazonaws.com/' + settings.get('userPoolId'),
      ClientId: settings.get('applicationId'),
    }],
    AllowUnauthenticatedIdentities: true, // required
    SupportedLoginProviders: {}, // no (external) federated login, for now
  };
  return new Promise(function(resolve, reject) {
    cognitoIdentity.createIdentityPool(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      console.log("createIdentityPool -> %j", data);
      console.log("createIdentityPool -> id:", data.IdentityPoolId);
      settings.set('identityPoolId', data.IdentityPoolId);
      return resolve(data);
    });
  });
}

function createAuthRole() {
  var policy = {
    Version: '2012-10-17',
    Statement: [{
      Effect: "Allow",
      Action: "sts:AssumeRoleWithWebIdentity",
      Principal: {
        Federated: "cognito-identity.amazonaws.com"
      },
      Condition: {
        StringEquals: {
          "cognito-identity.amazonaws.com:aud": settings.get('identityPoolId'),
        },
        'ForAnyValue:StringLike': {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }]
  };
  var policyJson = JSON.stringify(policy, null, 2);
  var params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property
    RoleName: config.authRoleName,
    AssumeRolePolicyDocument: policyJson,
  };
  return new Promise(function(resolve, reject) {
    amazonIAM.createRole(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      // console.log("createRole -> %j", data);
      console.log("createRole -> arn:", data.Role.Arn);
      settings.set('authRoleArn', data.Role.Arn);
      return resolve(data);
    });
  });
}

function createUnauthRole() {
  var policy = {
    Version: '2012-10-17',
    Statement: [{
      Effect: "Allow",
      Action: "sts:AssumeRoleWithWebIdentity",
      Principal: {
        Federated: "cognito-identity.amazonaws.com"
      },
      Condition: {
        StringEquals: {
          "cognito-identity.amazonaws.com:aud": settings.get('identityPoolId'),
        },
        'ForAnyValue:StringLike': {
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }]
  };
  var policyJson = JSON.stringify(policy, null, 2);
  var params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property
    RoleName: config.unauthRoleName,
    AssumeRolePolicyDocument: policyJson,
  };
  return new Promise(function(resolve, reject) {
    amazonIAM.createRole(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      // console.log("createRole -> %j", data);
      console.log("createRole -> arn:", data.Role.Arn);
      settings.set('unauthRoleArn', data.Role.Arn);
      return resolve(data);
    });
  });
}

function attachRoles() {
  var params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#setIdentityPoolRoles-property
    IdentityPoolId: settings.get('identityPoolId'),
    Roles: {
      authenticated: settings.get('authRoleArn'),
      unauthenticated: settings.get('unauthRoleArn'),
    }
  };
  return new Promise(function(resolve, reject) {
    cognitoIdentity.setIdentityPoolRoles(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      console.log("setIdentityPoolRoles -> %j", data);
      return resolve(data);
    });
  });
}

module.exports = setupPools;
