import React, { Component } from 'react';
import {connect} from 'react-redux';

import actions from '../app.actions';

const mapStateToProps = (state) => {
  return {
    username: state.getIn(['authUser', 'username']),
    isChallengedNewPassword: state.getIn(['authUser', 'authState']) === 'challengedNewPassword',
    cognitoAuth: state.getIn(['authUser', 'session']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authUiSetMessage: (message) => dispatch(actions.authUiSetMessage(message)),
  };
};

class AuthUiForcedPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      password1: '',
      password2: '',
      pending: false,
    }
  }

  setPassword1 = (e) => {
    this.setState({password1: e.target.value});
  }

  setPassword2 = (e) => {
    this.setState({password2: e.target.value});
  }

  isValid = () => {
    const {password1, password2} = this.state;
    return password1 === password2 &&
      !!password1;
  }

  completeLogin = async(e) => {
    e.preventDefault();
    const {password1} = this.state;
    const {cognitoAuth, authUiSetMessage} = this.props;

    this.setState({
      password1: '',
      password2: '',
      pending: true,
    });
    authUiSetMessage('');

    return cognitoAuth.login(null, password1)
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
    this.props.cognitoAuth.cancelLogin();
  }

  render() {
    const {username, isChallengedNewPassword} = this.props;
    const {password1, password2, pending} = this.state;

    return (
      <form>
        <fieldset disabled={!isChallengedNewPassword || pending}>
          <div className="form-group">
            <input type="text" value={username} disabled/>
            <input type="password" placeholder="Password" required value={password1} onChange={this.setPassword1}/>
            <input type="password" placeholder="Password" required value={password2} onChange={this.setPassword2}/>
            <button onClick={this.completeLogin} className="btn btn-primary" type="submit" disabled={!this.isValid()}>Complete Login</button>
            <button onClick={this.cancel} className="btn btn-default">Cancel</button>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthUiForcedPassword);
