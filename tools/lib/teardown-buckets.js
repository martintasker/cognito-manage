'use strict';

'HANDLE WITH CARE!!';

// todo: sanitize this along with its auths

var AWS = require('aws-sdk');

var config = require('./config');
var settings = require('./settings');

AWS.config.region = config.region;

var bucket = new AWS.S3({
  params: {
    Bucket: settings.get('bucketName'),
    region: config.region,
  }
});

const amazonIAM = new AWS.IAM();

function teardownBuckets() {
  return Promise.resolve()
  .then(() => detachBucketPolicyFromAuthRole(settings.get('bucketAuthPolicyArn')))
  .then(() => deletePolicy(settings.get('bucketAuthPolicyArn')))
  .then(deleteFiles)
  .then(deleteBucket)
  ;
}

function deleteBucket() {
  return new Promise(function(resolve, reject) {
    bucket.deleteBucket(function(err, data) {
      if (err) {
        return reject(err);
      }
      console.log("deleteBucket -> %j", data);
      return resolve(data);
    });
  });
}

function deleteFiles() {
  return new Promise(function(resolve, reject) {
    // note that deleteObjects() does not take '*' as Key
    bucket.deleteObjects({
      Delete: {
        Objects: [{
          Key: config.uploadFIleName,
        }],
        Quiet: true,
      }
    }, function(err, data) {
      if (err) {
        return reject(err);
      }
      console.log("deleteObjects -> %j", data);
      return resolve(data);
    });
  });
}

function deletePolicy(policyArn) {
  var params = {
    PolicyArn: policyArn,
  };
  return new Promise(function(resolve, reject) {
    amazonIAM.deletePolicy(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      console.log("deletePolicy -> %j", data);
      return resolve(data);
    });
  });
}

function detachBucketPolicyFromAuthRole(policyArn) {
  var params = {
    RoleName: config.authRoleName,
    PolicyArn: policyArn,
  };
  return new Promise(function(resolve, reject) {
    amazonIAM.detachRolePolicy(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      console.log("detachRolePolicy -> %j", data);
      return resolve(data);
    });
  });
}

module.exports = teardownBuckets;
