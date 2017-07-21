'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

var AWS = require('aws-sdk');

var config = require('../config/config');
var settings = require('./settings');

AWS.config.region = config.region;

const db = new AWS.DynamoDB();
const amazonIAM = new AWS.IAM();

const SCHEMA_PATH = path.resolve(__dirname, '../config/');

function setupTables() {
  return Promise.resolve()
  .then(getSchemaFilenames)
  .then(saveTableNames)
  .then(createDynamoTables)
  .then(createWritePolicy)
  .then(attachWritePolicyToAuthRole)
  .then(createReadPolicy)
  .then(attachReadPolicyToUnauthRole)
  ;
}

function getSchemaFilenames() {
  return new Promise((resolve, reject) => {
    fs.readdir(SCHEMA_PATH, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.filter(fn => path.extname(fn) === '.yaml').map(fn => path.resolve(SCHEMA_PATH, fn)));
    });
  });
}

function saveTableNames(schemaFilenames) {
  const schemas = schemaFilenames.map(fn => yaml.safeLoad(fs.readFileSync(fn)));
  const tableNames = schemas.map(schema => schema.TableName);
  settings.set('tableNames', tableNames);
  return Promise.resolve(schemas);
}

function createDynamoTables(schemas) {
  return schemas.reduce((inChain, schema) => {
    return inChain.then(() => {
      return db.createTable(schema).promise()
      .then(data => {
        console.log("createTable -> %j", data);
        settings.set('tables.' + schema.TableName, data.TableDescription.TableArn);
      });
    });
  }, Promise.resolve());
}

function createWritePolicy() {
  const tableNames = settings.get('tableNames');
  const tableARNs = tableNames.map(tableName => settings.get('tables.' + tableName));
  var policy = {
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Action: [
        "dynamodb:*",
      ],
      Resource: tableARNs,
    }]
  };
  var policyJson = JSON.stringify(policy, null, 2);
  const params = {
    PolicyName: config.authTablePolicyName,
    Description: 'Update tables',
    PolicyDocument: policyJson,
  };
  return amazonIAM.createPolicy(params).promise()
  .then(data => {
    console.log("createPolicy -> %j", data);
    console.log("createPolicy -> arn:", data.Policy.Arn);
    settings.set('authTablePolicyArn', data.Policy.Arn);
    return data;
  });
}

function attachWritePolicyToAuthRole() {
  const params = {
    RoleName: config.authRoleName,
    PolicyArn: settings.get('authTablePolicyArn'),
  };
  return amazonIAM.attachRolePolicy(params).promise()
  .then(data => {
    console.log("attachRolePolicy -> %j", data);
    return data;
  });
}

function createReadPolicy() {
  const tableNames = settings.get('tableNames');
  const tableARNs = tableNames.map(tableName => settings.get('tables.' + tableName));
  var policy = {
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Action: [
        "dynamodb:BatchGetItem",
        "dynamodb:DescribeTable",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:GetItem",
      ],
      Resource: tableARNs,
    }]
  };
  var policyJson = JSON.stringify(policy, null, 2);
  const params = {
    PolicyName: config.unauthTablePolicyName,
    Description: 'Read tables',
    PolicyDocument: policyJson,
  };
  return amazonIAM.createPolicy(params).promise()
  .then(data => {
    console.log("createPolicy -> %j", data);
    console.log("createPolicy -> arn:", data.Policy.Arn);
    settings.set('unauthTablePolicyArn', data.Policy.Arn);
    return data;
  });
}

function attachReadPolicyToUnauthRole() {
  const params = {
    RoleName: config.unauthRoleName,
    PolicyArn: settings.get('unauthTablePolicyArn'),
  };
  return amazonIAM.attachRolePolicy(params).promise()
  .then(data => {
    console.log("attachRolePolicy -> %j", data);
    return data;
  });
}

module.exports = setupTables;
