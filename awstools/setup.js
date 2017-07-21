'use strict';

var setupPools = require('./lib/setup-pools');
var setupBuckets = require('./lib/setup-buckets');
var setupTables = require('./lib/setup-tables');

var parser = new(require('argparse').ArgumentParser)();
parser.addArgument(['-p', '--pools'], {
  nargs: 0,
  help: 'construct user pools and IAM roles',
});
parser.addArgument(['-b', '--buckets'], {
  nargs: 0,
  help: 'construct buckets, with permissions',
});
parser.addArgument(['-t', '--tables'], {
  nargs: 0,
  help: 'construct tables, with permissions',
});
parser.addArgument(['-d', '--dry-run'], {
  nargs: 0,
  help: 'do not execute: just show args',
});
var args = parser.parseArgs();
if (args.dry_run) {
  console.log("args: %j", args);
  process.exit(1);
}

Promise.resolve()
.then(function() {
  if (args.pools) {
    return setupPools();
  } else {
    return Promise.resolve();
  }
})
.then(function() {
  if (args.bucket) {
    return setupBuckets();
  } else {
    return Promise.resolve();
  }
})
.then(function() {
  if (args.tables) {
    return setupTables();
  } else {
    return Promise.resolve();
  }
})
.catch(function(reason) {
  console.error("problem: %j", typeof reason === 'object' ? reason.toString() : reason);
});
