'use strict';

var ini = require('ini');
var fs = require('fs');

function getDefaultRegion() {
  var config = ini.parse(fs.readFileSync(homeDirectory() + '/.aws/config', 'utf-8'));
  var region = config.default.region;
  return region;
}

function homeDirectory() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

// override any of the below if you want to
exports.region = getDefaultRegion();

exports.siteName = 'Cognito-Auth Test Site';
exports.confirmationEmailSubject = 'Confirmation code from ' + exports.siteName;
exports.confirmationEmailBody = 'Your code is: {####}.  Enter it in the confirmation dialog.';

exports.userPoolName = 'cognito-auth Test User Pool';
exports.appName = 'cognito-auth Test Application';
exports.poolName = 'CognitoAuthTestIdentityPool';
exports.authRoleName = 'CognitoAuthTest-AuthRole';
exports.unauthRoleName = 'CognitoAuthTest-UnauthRole';

exports.bucketName = 'bucket.example.com';
exports.authBucketPolicyName = exports.authRoleName + '-WriteBucket';
exports.uploadFileName = 'data/*'; // todo: sanitize

exports.authTablePolicyName = exports.authRoleName + '-WriteTable';
