import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

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
    this.config.onLogin && this.config.onLogin(this, currentUser);
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
}

export default CognitoAuth;
