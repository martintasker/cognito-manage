import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

class CognitoAuth {
  /**
   * 
   * @param {*} config configuration
   *  AWS_REGION
   *  AWS_USER_POOL_ID
   *  AWS_APP_ID
   *  AWS_ID_POOL_ID
   *  TRACE
   *  onLogin()
   *  onLogout()
   */
  constructor(config) {
    this.config = config;

    window.AWS.config.region = this.config.AWS_REGION;

    this.cognitoIDP = 'cognito-idp.' + this.config.AWS_REGION + '.amazonaws.com/' + this.config.AWS_USER_POOL_ID;
    this.userPool = new CognitoUserPool({
      UserPoolId: this.config.AWS_USER_POOL_ID,
      ClientId: this.config.AWS_APP_ID,
    });

    this.currentUser = null;
    this.partialUser = null;

    this.setInitialCredentials();
  }

  trace = () => {
    if (this.config.TRACE) {
      console.log.apply(null, arguments);
    }
  }

  onLogout = () => {
    this.config.onLogout && this.config.onLogout();
  }

  onLogin = (currentUser) => {
    this.config.onLogin && this.config.onLogin(currentUser);
  }

  onLoginChallengeNewPassword = (user, attribsGiven, attribsRequired) => {
    this.config.onLoginChallengeNewPassword && this.config.onLoginChallengeNewPassword(user, attribsGiven, attribsRequired);
  }

  setInitialCredentials = () => {
    this.trace("CognitoAuth.setInitialCredentials()");
    window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.config.AWS_ID_POOL_ID,
    });
    var cognitoUser = this.userPool.getCurrentUser();
    if (!cognitoUser) {
      this.trace("retrieveUser: no user from previous session");
      this.onLogout();
      return;
    }
    cognitoUser.getSession((err, session) => {
      if (err || !session.isValid()) {
        if (err) {
          this.trace("retrieveUser: getSession error", err);
        } else {
          this.trace("retrieveUser: previous session is not valid");
        }
        this.onLogout();
        return;
      }
      this.trace("getSession: session", session);

      const logins = {};
      logins[this.cognitoIDP] = session.getIdToken().getJwtToken();
      window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.config.AWS_ID_POOL_ID,
        Logins: logins
      });
      this.currentUser = cognitoUser;
      this.trace("AWS.config.credentials constructed", window.AWS.config.credentials);
      this.onLogin(this.currentUser);
    });
  }

  login = async(username, password) => {
    this.trace("CognitoAuth.login() --", username, '(password)');
    if (username) {
      this.partialUser = new CognitoUser({
        Username: username,
        Pool: this.userPool,
      });
    }

    const getAuthCallbacks = (resolve, reject) => {
      return {
        onFailure: (err) => {
          console.log("cognitoUser.authenticateUser() error:", err);
          reject(err);
        },
        onSuccess: (res) => {
          this.trace("cognitoUser.authenticate/complete-challenge result:", res);
          var logins = {};
          logins[this.cognitoIDP] = res.getIdToken().getJwtToken();
          window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials({
            IdentityPoolId: this.config.AWS_ID_POOL_ID,
            Logins: logins
          });
          this.trace("login: success");
          resolve(this.partialUser);
        },
        newPasswordRequired: (attribsGiven, attribsRequired) => {
          this.trace("authenticate: newPasswordRequired, attribsGiven:", attribsGiven, "attribsRequired:", attribsRequired);
          this.onLoginChallengeNewPassword(this.partialUser, attribsGiven, attribsRequired);
          reject('new password required');
        }
      }
    }

    const doLogin = async () => {
      this.trace("CognitoAuth.login() -- doLogin() --", username, '(password)');
      return new Promise((resolve, reject) => {
        if (username) {
          this.partialUser.authenticateUser(new AuthenticationDetails({
            Username: username,
            Password: password,
          }), getAuthCallbacks(resolve, reject));
        } else {
          this.partialUser.completeNewPasswordChallenge(password, {}, getAuthCallbacks(resolve, reject));
        }
      });
    }

    return Promise.resolve()
    .then(doLogin)
    .then(() => {
      this.currentUser = this.partialUser;
      this.partialUser = null;
      this.trace("authenticate: overall success");
      this.onLogin(this.currentUser);
    })
    .catch(reason => {
      var oldCurrentUser = this.currentUser;
      this.currentUser = null;
      if (oldCurrentUser) {
        this.onLogout();
      }
      throw reason;
    });
  }

  logout = () => {
    this.trace("CognitoAuth.logout()");
    return new Promise((resolve, reject) => {
      if (!this.currentUser) {
        reject("no current user: cannot logout");
        return;
      }
      this.currentUser.signOut();
      this.currentUser = null;
      this.setDefaultCredentials();
      resolve();
      this.trace("success");
    });
  }

  setDefaultCredentials = () => {
    this.trace("CognitoAuth.setDefaultCredentials()");
    window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.config.AWS_ID_POOL_ID,
    });
    this.onLogout();
  }
}

export default CognitoAuth;
