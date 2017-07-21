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
    authUiSetMessage: (message) => dispatch(actions.authUiSetMessage(message)),
    authUiSetAuthState: (authState) => dispatch(actions.authUiSetAuthState(authState)),
  };
};

class AuthUiLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      pending: false,
    }
  }

  setUsername = (e) => {
    this.setState({username: e.target.value});
  }

  setPassword = (e) => {
    this.setState({password: e.target.value});
  }

  forgotPassword = (e) => {
    e.preventDefault();
    this.props.authUiSetAuthState('forgotPassword');
  }

  login = async(e) => {
    e.preventDefault();
    const {username, password} = this.state;
    const {cognitoAuth, authUiSetMessage} = this.props;

    this.setState({
      password: '',
      pending: true,
    });
    authUiSetMessage('');

    return cognitoAuth.login(username, password)
    .then(() => {
      console.log("logged in");
      this.setState({pending: false});
    })
    .catch((reason) => {
      console.error("error logging in", reason);
      this.setState({pending: false});
      authUiSetMessage(reason);
    });
  }

  cancel = (e) => {
    e.preventDefault();
    this.props.authUiSetMessage('');
    this.setState({
      username: '',
      password: '',
    });
  }

  isValid = () => {
    const {username, password} = this.state;
    return !!username && !!password;
  }

  render() {
    const {isLoggedIn} = this.props;
    const {username, password, pending} = this.state;

    return (
      <form>
        <fieldset disabled={isLoggedIn || pending}>
          <div className="form-group">
            <input type="text" placeholder="User name" required value={username} onChange={this.setUsername}/>
            <input type="password" placeholder="Password" required value={password} onChange={this.setPassword}/>
            <button onClick={this.login} className="btn btn-primary" type="submit" disabled={!this.isValid()}>Login</button>
            <button onClick={this.forgotPassword} className="btn btn-primary">Forgot password</button>
            <button onClick={this.cancel} className="btn btn-default">Cancel</button>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthUiLogin);
