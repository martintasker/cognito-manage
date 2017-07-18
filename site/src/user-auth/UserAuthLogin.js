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

class UserAuthLogin extends Component {

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

  login = async(e) => {
    e.preventDefault();
    const {username, password} = this.state;
    const {cognitoAuth, loginUiSetMessage} = this.props;

    this.setState({
      password: '',
      pending: true,
    });
    loginUiSetMessage('');

    return cognitoAuth.login(username, password)
    .then(() => {
      console.log("logged in");
      this.setState({pending: false});
    })
    .catch((reason) => {
      console.error("error logging in", reason);
      this.setState({pending: false});
      loginUiSetMessage(reason);
    });
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
            <button onClick={this.login} className="btn btn-primary" type="submit">Login</button>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAuthLogin);
