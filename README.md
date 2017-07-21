# cognito

Aim:

* Cognito authentication with a number of interesting scenarios
* React-based demo code, client-side
* node-based admin code, from command-line (in `awstools/`)

Current state of play:

* tools to set up and query identity pools
* tools to add user and query users
* client-side code to complete admin-initiated registration
* client-side tools to manage login, logout, deregistration,
  change password, forgotten password
* two-tier Cognito-only pools, so you can have public and user
  roles, or public and editor/admin

Immediate intent:

* add self-signup
* add third role, so that it's possible to distinguish,
  for example, between user and editor/admin (as well as public)
* more comprehensive admin tools
* packaging improvements to improve app size

Longer-range possibilities:

* nicer modularization, packaging and documentation, to make code re-use easier
* add MFA
* add federated sign-up, eg via Facbook etc

Pros and cons of using Amazon Cognito authentication:

* pro: integrates directly with back-end AWS IAM roles, so that
  you can reason very directly what your client is authorized to
  do on the back-end
* pro: enables serverless app development by invoking AWS services
  such as S3 and DynamoDB directly from the client
* con: the AWS SDK for JavaScript, and `amazon-cognito-identity-js`
  itself, are quite large, so that compared with other
  authentication methods they produce a slow-to-load application
  with potentially significant network costs
* you can address the con, if you wish, by using other types of
  authentication, or by lazy loading so that at least public
  access doesn't require authentication-related code download,
  or by a custom build of the AWS SDK for only the services you require

History: this fairly new repo is based on code lifted and shifted
from the Angular-based
[`cognito-auth`](http://github.com/martintasker/cognito-auth) project.
It would have been
nice to have kept a single repo with history, but somehow that
didn't happen.  In the interim, the node code has been made
somewhat more Es6-friendly (while still running native, without
Babel), AWS SDK dependencies have been updated (they are now
packaged much more nicely, especially `amazon-cognito-identity-js`),
and client-side code has been migrated to React.

## How to use

Assuming you have an installation of the AWS CLI with
developer keys suitable for your project, then,
from the `awstools/` directory,

* `npm install`
* copy `lib/config.sample.js` to `lib/config.js` and edit, to carefully specify the relevant parameters
  (`lib/config.js` is **not** under source control)
* run `node setup -p` to setup the user and identity pools
* run `node add-user -u xxx -e xxx@example.com` to create a user:
  the email you specify will receive a password which you'll need on first login

Then, from the root folder,

* `npm install`
* note that `src/aws-config.js` contains the configuration parameters built by the `setup` phase above,
  but that this is **not** under source control
* `npm start` to start the test application
* check the email you specified above, for the system-assigned password, and try to log in with it
* complete the new password in the forced-password form
* you can then log out, deregister, log in, and manage forgotten password

Back in `awstools/`:

* run `node query` to query the pools and user
* run `node add-user` to add more users, any time
* run `node teardown -p` to tear down the pools

Now that you know you have user+identity pools which work,
you can lift and shift them into your own application:
you will need, from `src/`,

* the JavaScript code in `cognito-auth/`, as-is
* `aws-config.js` and `settings.json`
* the relevant stub code in `App.js`
* the Redux code in `auth-user/`, which manages authentication
  state and is all that the majority of your app should need
* the React and Redux code in `auth-ui`, with the UI components
  tweaked to taste
* the Redux imports and compositions in `app.reducer.js` and `app.actions.js`

You'll also need to include the AWS SDK in your project,
along with `amazon-cognito-identity-js`.  It's easiest to
install both using npm.
