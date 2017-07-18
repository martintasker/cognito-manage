# cognito

Aim: a Cognito-based setup

* React app with login, logout, register, deregister, forced password update, change password, confirm password,
  enter confirmation code, request re-send confirmation code -- ie, all registration and self-service paraphernalia
  except for MFA and except for federated
* admin scripts to set up identity pools

There are various types of authentication setup which Cognito can support:

* single-tier federated eg from Facebook
* single-tier, with self-registration and self-management
* single-tier, with root grants, self-management and public access
* two-tier, with root registration of admins, admin registration of users, self-management, and no public access
* additional frills with MFA
* additional frills with profile management

The easiest to implement are single-tier federated and single-tier with self-signup and self-management.

The ones of most immediate interest to me involve root grants and no self-signup.

## Root grants, no self-signup

## Two-tier privilege

## State of play

From the `tools/` directory,

* `npm install`
* copy `lib/config.sample.js` to `lib/config.js` and edit, to carefully specify the relevant parameters
  (`lib/config.js` is **not** under source control)
* run `node setup -p` to setup the pools

Then, from `site/`,

* `npm install`
* note that `src/aws-config.js` contains the configuration parameters built by the `setup` phase above,
  but that this is **not** under source control
* `npm start` to start the test application

Some of the site functionality isn't implemented yet, as indicated by grey-out.

You can also query and change: from `tools/`:

* run `node teardown -p` to tear down the pools
* `node add-user` to add a user
* `node query` to query the pool and user

There is some not-adequately functioning code in `tools/` to set up and tear down buckets:
this will be replaced by a better, roles-first approach.
