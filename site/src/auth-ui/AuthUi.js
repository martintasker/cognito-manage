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
    authUiMessage: state.getIn(['authUi', 'message']),
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
    const {isLoggedIn, username, authUiMessage} = this.props;
    console.log("isLoggedIn, username =", isLoggedIn, username);

    return (
      <div>
        {authUiMessage &&
          <div className="row">
            <div className="col-xs-12">
              <p style={{fontWeight:'bold',color:'darkred'}}>{authUiMessage.toString()}</p>
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
            {!isLoggedIn &&
              <div>
                <AuthUiLogin/>
                <AuthUiForgotPassword/>
                <AuthUiSetPasswordWithCode/>
                <AuthUiForcedPassword/>
              </div>
            }
            {isLoggedIn &&
              <div>
                <AuthUiLogout/>
                <AuthUiChangePassword/>
                <AuthUiDeregister/>
              </div>
            }
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthUi);
