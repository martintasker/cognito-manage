import React from 'react';

import {createStore} from 'redux';
import appReducer from './app.reducer';
import {Provider} from 'react-redux';

import UserAuthUi from './user-auth/UserAuthUi';

import 'aws-sdk';
import CognitoAuth from './cognito-auth/cognito-auth';

import AWSconfig from './aws-config';

const store = createStore(appReducer);

const config = {
  ...AWSconfig,
  TRACE: true,
  onLogin: (currentUser) => console.log("logged in", currentUser),
  onLogout: () => console.log("logged out"),
};

var cognitoAuth = new CognitoAuth(config);

const App = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
