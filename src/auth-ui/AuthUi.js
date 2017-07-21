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
import AuthUiProfile from './AuthUiProfile';

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.getIn(['authUser', 'isLoggedIn']),
    username: state.getIn(['authUser', 'username']),
    authUiMessage: state.getIn(['authUi', 'message']),
    authUiState: state.getIn(['authUi', 'authState']),
  };
};

class AuthUi extends Component {

  render() {
    const {isLoggedIn, username, authUiMessage, authUiState} = this.props;
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
                {authUiState === 'neutral' &&
                  <AuthUiLogin/>
                }
                {authUiState === 'forgotPassword' &&
                  <AuthUiForgotPassword/>
                }
                {authUiState === 'setNewPasswordWithCode' &&
                  <AuthUiSetPasswordWithCode/>
                }
                {authUiState === 'forceNewPassword' &&
                  <AuthUiForcedPassword/>
                }
              </div>
            }
            {isLoggedIn &&
              <div>
                <AuthUiLogout/>
                <AuthUiProfile/>
                {authUiState === 'showProfile' &&
                  <div>
                    <AuthUiChangePassword/>
                    <AuthUiDeregister/>
                  </div>
                }
              </div>
            }
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthUi);
