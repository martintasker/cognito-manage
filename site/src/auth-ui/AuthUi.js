import React, { Component } from 'react';
import {connect} from 'react-redux';

import './auth-ui.css';

import AuthUiLogin from './AuthUiLogin';
import AuthUiLogout from './AuthUiLogout';
import AuthUiDeregister from './AuthUiDeregister';
import AuthUiForcedPassword from './AuthUiForcedPassword';
import AuthUiChangePassword from './AuthUiChangePassword';
import AuthUiForgotPassword from './AuthUiForgotPassword';
import AuthUiSetPasswordWithCode from './AuthUiSetPasswordWithCode';

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.getIn(['authUser', 'isLoggedIn']),
    username: state.getIn(['authUser', 'username']),
    loginUiMessage: state.getIn(['loginUi', 'message']),
  };
};

class AuthUi extends Component {

  register = (e) => {
    e.preventDefault();
  }

  confirmRegistration = (e) => {
    e.preventDefault();
  }

  resendConfirmationCode = (e) => {
    e.preventDefault();
  }

  setPasswordWithCode = (e) => {
    e.preventDefault();
  }

  completeLogin = (e) => {
    e.preventDefault();
  }

  render() {
    const {isLoggedIn, username, loginUiMessage} = this.props;
    console.log("isLoggedIn, username =", isLoggedIn, username);

    return (
      <div>
        {loginUiMessage &&
          <div className="row">
            <div className="col-xs-12">
              <p style={{fontWeight:'bold',color:'darkred'}}>{loginUiMessage.toString()}</p>
            </div>
          </div>
        }

        <div className="row">
          <div className="col-xs-12">
            {isLoggedIn &&
              <p style={{fontWeight:'bold',color:'darkgreen'}}>Logged in as {username}.</p>
            }
            {!isLoggedIn &&
              <p>Not logged in.</p>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <h2>Login</h2>
          </div>

          <div className="col-xs-2">
            Login
          </div>
          <div className="col-xs-10">
            <AuthUiLogin/>
          </div>

          <div className="col-xs-2">
            Forgotten password: request
          </div>
          <div className="col-xs-10">
            <AuthUiForgotPassword/>
          </div>

          <div className="col-xs-2">
            Forgotten password: reset
          </div>
          <div className="col-xs-10">
            <AuthUiSetPasswordWithCode/>
          </div>

          <div className="col-xs-2">
            Logout
          </div>
          <div className="col-xs-10">
            <AuthUiLogout/>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <h2>Profile management</h2>
          </div>

          <div className="col-xs-2">
            Request change password
          </div>
          <div className="col-xs-10">
            <AuthUiChangePassword/>
          </div>

          <div className="col-xs-2">
            Deregister
          </div>
          <div className="col-xs-10">
            <AuthUiDeregister/>
          </div>
        </div>
        
        <div className="row">
          <div className="col-xs-12">
            <h2>Complete registration</h2>
          </div>

          <div className="col-xs-2">
            Forced new password
          </div>
          <div className="col-xs-10">
            <AuthUiForcedPassword/>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthUi);
