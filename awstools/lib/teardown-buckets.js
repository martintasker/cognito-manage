'use strict';

'HANDLE WITH CARE!!';

// todo: sanitize this along with its auths

var AWS = require('aws-sdk');

var config = require('../config/config');
var settings = require('./settings');

AWS.config.region = config.region;

const s3 = new AWS.S3();
const amazonIAM = new AWS.IAM();

const deletePolicy = require('./delete-policy');

function teardownBuckets() {
  return Promise.resolve()
  .then(() => deletePolicy(settings.get('bucketAuthPolicyArn')))
  .then(deleteFiles)
  .then(deleteBucket)
  ;
}

function deleteBucket() {
  const params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
    Bucket: settings.get('bucketName'),
  };
  return s3.deleteBucket(params).promise()
  .then(data => {
    console.log("deleteBucket -> %j", data);
    return data;
  });
}

function deleteFiles() {
  const params = {
    // see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property
    // note that deleteObjects() does not take '*' as Key
    Bucket: settings.get('bucketName'),
    Delete: {
      Objects: [{
        Key: config.uploadFileName,
      }],
      Quiet: true,
    }
  };
  return s3.deleteObjects(params).promise()
  .then(data => {
    console.log("deleteObjects -> %j", data);
    return data;
  });
}

module.exports = teardownBuckets;
