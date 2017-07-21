import React from 'react';

import {createStore} from 'redux';
import appReducer from './app.reducer';
import {Provider} from 'react-redux';
import actions from './app.actions';

import AuthUi from './auth-ui/AuthUi';

import 'aws-sdk';
import CognitoAuth from './cognito-auth/cognito-auth';

import AWSconfig from './aws-config';

const store = createStore(appReducer);

const config = {
  ...AWSconfig,
  TRACE: true,
  onLogin: (user) => {
    console.log("logged in", user);
    store.dispatch(actions.authUserLogin(user.username, {}));
    store.dispatch(actions.authUiSetAuthState('neutral'));
  },
  onLogout: () => {
    console.log("logged out");
    store.dispatch(actions.authUserLogout());
    store.dispatch(actions.authUiSetAuthState('neutral'));
  },
  onLoginChallengeNewPassword: (user, attribsGiven, attribsRequired) => {
    console.log("login challenged: new password required", attribsGiven, attribsRequired);
    store.dispatch(actions.authUiSetAuthState('forceNewPassword'));
  },
};

var cognitoAuth = new CognitoAuth(config);
store.dispatch(actions.authUserSetSession(cognitoAuth));

const App = () => {
  return (
    <Provider store={store}>
      <div className="container">

        <AuthUi/>

        <div className="row">
          <div className="col-xs-12">
            <h1>Cognito Auth Test</h1>
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
