'use strict';

var AWS = require('aws-sdk');

var config = require('../config/config');
AWS.config.region = config.region;
const amazonIAM = new AWS.IAM();

function deletePolicy(policyArn) {
  return Promise.resolve()
  .then(listRoles)
  .then(detachFromRoles)
  .then(deleteFinally);

  function listRoles() {
    const params = {
      PolicyArn: policyArn,
      EntityFilter: 'Role',
    };
    return amazonIAM.listEntitiesForPolicy(params).promise()
    .then(data => {
      console.log("listEntitiesForPolicy (roles) -> %j", data.PolicyRoles);
      return data.PolicyRoles;
    });
  }

  function detachFromRoles(roles) {
    return roles.reduce((inChain, role) => {
      return inChain
      .then(() => {
        const params = {
          RoleName: role.RoleName,
          PolicyArn: policyArn,
        };
        return amazonIAM.detachRolePolicy(params).promise();
      })
      .then(data => {
        console.log("detachRolePolicy -> %j", data);
      });
    }, Promise.resolve());
  }

  function deleteFinally() {
    const params = {
      PolicyArn: policyArn,
    };
    return amazonIAM.deletePolicy(params).promise()
    .then(data => {
      console.log("deletePolicy -> %j", data);
      return data;
    });
  }
}

module.exports = deletePolicy;
