'use strict';

// todo: sanitize this along with its auths

var AWS = require('aws-sdk');

var config = require('../config/config');
var settings = require('./settings');

AWS.config.region = config.region;

const s3 = new AWS.S3();
const amazonIAM = new AWS.IAM();

function setupBuckets() {
  settings.set('bucketName', config.bucketName);
  return Promise.resolve()
  .then(createBucket)
  .then(attachCORSToBucket)
  .then(createWriteBucketPolicy)
  .then(attachWriteBucketPolicyToAuthRole)
  ;
}

function createBucket() {
  const params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
    Bucket: config.bucketName,
    CreateBucketConfiguration: {
      LocationConstraint: config.region,
    },
  };
  return s3.createBucket(params).promise()
  .then(data => {
    console.log("createBucket -> %j", data);
    return data;
  });
}

function attachCORSToBucket() {
  const params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketCors-property
    Bucket: config.bucketName,
    CORSConfiguration: {
      CORSRules: [{
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
        AllowedOrigins: ['*'],
        AllowedHeaders: ['*'],
        ExposeHeaders: ['ETag', 'x-amz-meta-custom-header'],
        MaxAgeSeconds: 3000
      }]
    }
  };
  return s3.putBucketCors(params).promise()
  .then(data => {
    console.log("putBucketCors -> %j", data);
    return data;
  });
}

function createWriteBucketPolicy() {
  var policy = {
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Action: [
        "s3:GetObject",
        "s3:PutObject",
        "s3:putObjectACL"
      ],
      Resource: [
        "arn:aws:s3:::" + settings.get('bucketName') + "/" + config.uploadFileName,
      ]
    }]
  };
  var policyJson = JSON.stringify(policy, null, 2);
  const params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createPolicy-property
    PolicyName: config.authBucketPolicyName,
    Description: 'Write to bucket',
    PolicyDocument: policyJson,
  };
  return amazonIAM.createPolicy(params).promise()
  .then(data => {
    console.log("createPolicy -> %j", data);
    console.log("createPolicy -> arn:", data.Policy.Arn);
    settings.set('bucketAuthPolicyArn', data.Policy.Arn);
    return data;
  });
}

function attachWriteBucketPolicyToAuthRole() {
  const params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#attachRolePolicy-property
    RoleName: config.authRoleName,
    PolicyArn: settings.get('bucketAuthPolicyArn'),
  };
  return amazonIAM.attachRolePolicy(params).promise()
  .then(data => {
    console.log("attachRolePolicy -> %j", data);
    return data;
  });
}

module.exports = setupBuckets;
