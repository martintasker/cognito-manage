'use strict';

'HANDLE WITH CARE!!';

var AWS = require('aws-sdk');

var config = require('../config/config');
var settings = require('./settings');

AWS.config.region = config.region;

const db = new AWS.DynamoDB();
const amazonIAM = new AWS.IAM();

const deletePolicy = require('./delete-policy');

function teardownTables() {
  return Promise.resolve()
  .then(() => deletePolicy(settings.get('unauthTablePolicyArn')))
  .then(() => deletePolicy(settings.get('authTablePolicyArn')))
  .then(deleteTables)
  ;
}

function deleteTables() {
  const tableNames = settings.get('tableNames');
  return tableNames.reduce((inChain, tableName) => {
    return inChain
    .then(() => db.deleteTable({TableName: tableName}).promise())
    .then(data => {
      console.log("deleteTable -> %j", data);
    });
  }, Promise.resolve());
}

module.exports = teardownTables;
