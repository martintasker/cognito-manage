import React, { Component } from 'react';
import {connect} from 'react-redux';

import actions from '../app.actions';

const mapStateToProps = (state) => {
  return {
    isChallengedNewPassword: state.getIn(['authUser', 'authState']) === 'challengedNewPassword',
    cognitoAuth: state.getIn(['authUser', 'session']),
  };
};

// todo: add user reassurance
// todo: add cancel

const mapDispatchToProps = (dispatch) => {
  return {
    loginUiSetMessage: (message) => dispatch(actions.loginUiSetMessage(message)),
  };
};

class UserAuthForcedPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      pending: false,
    }
  }

  setPassword = (e) => {
    this.setState({password: e.target.value});
  }

  completeLogin = async(e) => {
    e.preventDefault();
    const {password} = this.state;
    const {cognitoAuth, loginUiSetMessage} = this.props;

    this.setState({
      password: '',
      pending: true,
    });
    loginUiSetMessage('');

    return cognitoAuth.login(null, password)
    .then(() => {
      console.log("logged in");
      this.setState({pending: false});
    })
    .catch((reason) => {
      console.log("error logging in", reason);
      this.setState({pending: false});
      loginUiSetMessage(reason);
    });
  }

  render() {
    const {isChallengedNewPassword} = this.props;
    const {password, pending} = this.state;

    return (
      <form>
        <fieldset disabled={!isChallengedNewPassword || pending}>
          <div className="form-group">
            <input type="password" placeholder="Password" required value={password} onChange={this.setPassword}/>
            <button onClick={this.completeLogin} className="btn btn-primary" type="submit">Complete Login</button>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAuthForcedPassword);
