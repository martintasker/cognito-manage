import React, { Component } from 'react';

import UserAuthUi from './user-auth/UserAuthUi';

import 'aws-sdk';
import CognitoAuth from './cognito-auth/cognito-auth';

import AWSconfig from './aws-config';

const config = {
  ...AWSconfig,
  TRACE: true,
  onLogin: (currentUser) => console.log("logged in", currentUser),
  onLogout: () => console.log("logged out"),
};

var cognitoAuth = new CognitoAuth(config);

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h1>Cognito Test</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <p>(test code)</p>
          </div>
        </div>

        <UserAuthUi/>
        
      </div>
    );
  }
}

export default App;
