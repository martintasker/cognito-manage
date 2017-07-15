import React from 'react';

import {createStore} from 'redux';
import appReducer from './app.reducer';
import {Provider} from 'react-redux';
import actions from './app.actions';

import UserAuthUi from './user-auth/UserAuthUi';

import 'aws-sdk';
import CognitoAuth from './cognito-auth/cognito-auth';

import AWSconfig from './aws-config';

const store = createStore(appReducer);

const config = {
  ...AWSconfig,
  TRACE: true,
  onLogin: (session, user) => {
    console.log("logged in", user);
    store.dispatch(actions.authUserLogin(user.username, {}));
    store.dispatch(actions.authUserSetSession(session));
  },
  onLogout: () => {
    console.log("logged out");
    store.dispatch(actions.authUserLogout());
  },
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
