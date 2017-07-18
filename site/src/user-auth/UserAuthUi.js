import React, { Component } from 'react';
import {connect} from 'react-redux';

import UserAuthLogin from './UserAuthLogin';
import UserAuthLogout from './UserAuthLogout';
import UserAuthDeregister from './UserAuthDeregister';
import UserAuthForcedPassword from './UserAuthForcedPassword';
import UserAuthChangePassword from './UserAuthChangePassword';

import actions from '../app.actions';

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.getIn(['authUser', 'isLoggedIn']),
    username: state.getIn(['authUser', 'username']),
    loginUiMessage: state.getIn(['loginUi', 'message']),
  };
};

class UserAuthUi extends Component {

  register = (e) => {
    e.preventDefault();
  }

  confirmRegistration = (e) => {
    e.preventDefault();
  }

  resendConfirmationCode = (e) => {
    e.preventDefault();
  }

  requestNewPasswordCode = (e) => {
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
            <h2>Login lifecycle</h2>
          </div>

          <div className="col-xs-2">
            Login
          </div>
          <div className="col-xs-10">
            <UserAuthLogin/>
          </div>

          <div className="col-xs-2">
            Forced new password
          </div>
          <div className="col-xs-10">
            <UserAuthForcedPassword/>
          </div>

          <div className="col-xs-2">
            Logout
          </div>
          <div className="col-xs-10">
            <UserAuthLogout/>
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
            <UserAuthChangePassword/>
          </div>
        </div>
        
        <div className="row">
          <div className="col-xs-12">
            <h2>Registration lifecycle</h2>
            <p>You may register</p>
            <ul>
              <li>yourself, if you're not authenticated, and it's a self-service user pool</li>
              <li>someone else, if you are authenticated, and you have admin permissions</li>
            </ul>
            <p>Either way, email confirmation and password reset are required before the registered user can log in.</p>
            <p>It's easier to manage users if you require their username to be their email address.</p>
          </div>

          <div className="col-xs-2">
            &nbsp;
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" name="emailonly"/>Use email addresses as usernames
                    </label>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Register
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <input type="text" name="email" placeholder="Email Address" required />
                  <input type="password" name="password" placeholder="Password" required />
                  <button onClick={this.register} className="btn btn-primary" type="submit">Register</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Confirm
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <input type="text" name="code" placeholder="Code" required />
                  <button onClick={this.confirmRegistration} className="btn btn-primary" type="submit">Confirm</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Lost code
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <button onClick={this.resendConfirmationCode} className="btn btn-primary" type="submit">Request New Code</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Forgotten password: request
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <button onClick={this.requestNewPasswordCode} className="btn btn-primary" type="submit">Request Reset Code</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Forgotten password: reset
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <input type="text" name="code" placeholder="Confirmation code" required />
                  <input type="password" name="password" placeholder="New Password" required />
                  <button onClick={this.setPasswordWithCode} className="btn btn-primary" type="submit">Set New Password</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Deregister
          </div>
          <div className="col-xs-10">
            <UserAuthDeregister/>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(UserAuthUi);
