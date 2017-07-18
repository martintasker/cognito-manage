import React, { Component } from 'react';
import {connect} from 'react-redux';

import actions from '../app.actions';

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.getIn(['authUser', 'isLoggedIn']),
    cognitoAuth: state.getIn(['authUser', 'session']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginUiSetMessage: (message) => dispatch(actions.loginUiSetMessage(message)),
  };
};

class AuthUiSetPasswordWithCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      code: '',
      password1: '',
      password2: '',
      pending: false,
    }
  }

  setUsername = (e) => {
    this.setState({username: e.target.value});
  }

  setCode = (e) => {
    this.setState({code: e.target.value});
  }

  setPassword1 = (e) => {
    this.setState({password1: e.target.value});
  }

  setPassword2 = (e) => {
    this.setState({password2: e.target.value});
  }

  isValid = () => {
    const {oldPassword, password1, password2} = this.state;
    return password1 === password2 &&
      !!password1 &&
      !!oldPassword;
  }

  setPasswordWithCode = async(e) => {
    e.preventDefault();
    const {username, code, password1} = this.state;
    const {loginUiSetMessage, cognitoAuth} = this.props;

    this.setState({
      username: '',
      code: '',
      password1: '',
      password2: '',
      pending: true,
    });

    loginUiSetMessage('');

    return cognitoAuth.setPasswordWithCode(username, password1, code)
    .then(() => {
      console.log("changed password");
    })
    .then(() => cognitoAuth.login(username, password1))
    .then(() => {
      console.log("logged in");
      this.setState({pending: false});
    })
    .catch((reason) => {
      console.error("error changing password or logging in", reason);
      this.setState({pending: false});
      loginUiSetMessage(reason);
    });
  }

  cancel = (e) => {
    e.preventDefault();
    this.setState({
      username: '',
      code: '',
      password1: '',
      password2: '',
    });
  }

  isValid = () => {
    const {username, code, password1, password2} = this.state;
    return !!username &&
      !!code && code.length === 6 &&
      !!password1 && !!password2 && password1 === password2;
  }

  render() {
    const {isLoggedIn} = this.props;
    const {username, code, password1, password2, pending} = this.state;

    return (
      <form>
        <fieldset disabled={isLoggedIn || pending}>
          <div className="form-group">
            <input type="text" placeholder="User name" value={username} onChange={this.setUsername}/>
            <input type="text" placeholder="Confirmation code" value={code} onChange={this.setCode}/>
            <input type="password" placeholder="New Password" value={password1} onChange={this.setPassword1}/>
            <input type="password" placeholder="Confirm Password" value={password2} onChange={this.setPassword2}/>
            <button onClick={this.setPasswordWithCode} className="btn btn-primary" type="submit" disabled={!this.isValid()}>Set New Password</button>
            <button onClick={this.cancel} className="btn btn-default">Cancel</button>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthUiSetPasswordWithCode);
