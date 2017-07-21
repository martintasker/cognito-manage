'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

var AWS = require('aws-sdk');

var config = require('./config');
var settings = require('./settings');

AWS.config.region = config.region;

const db = new AWS.DynamoDB();
const amazonIAM = new AWS.IAM();

function setupTables() {
  return Promise.resolve()
  .then(getSchemaFilenames)
  .then(saveTableNames)
  .then(createDynamoTables)
  ;
}

function getSchemaFilenames() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, '../schema'), (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.filter(fn => path.extname(fn) === '.yaml').map(fn => path.resolve(__dirname, '../schema', fn)));
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

module.exports = setupTables;
