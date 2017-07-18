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

class AuthUiChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      password1: '',
      password2: '',
      pending: false,
    }
  }

  setOldPassword = (e) => {
    this.setState({oldPassword: e.target.value});
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

  changePassword = async(e) => {
    e.preventDefault();
    const {oldPassword, password1} = this.state;
    const {loginUiSetMessage, cognitoAuth} = this.props;

    this.setState({
      oldPassword: '',
      password1: '',
      password2: '',
      pending: true,
    });

    return cognitoAuth.changePassword(oldPassword, password1)
    .then(() => {
      console.log("changed password");
      this.setState({pending: false});
    })
    .catch((reason) => {
      console.error("error changing password", reason);
      this.setState({pending: false});
      loginUiSetMessage(reason);
    });
  }

  // todo: plumb "changing password" into UI state
  cancel = (e) => {
    e.preventDefault();
    this.setState({
      oldPassword: '',
      password1: '',
      password2: '',
    });
  }

  render() {
    const {isLoggedIn} = this.props;
    const {oldPassword, password1, password2, pending} = this.state;

    return (
      <form>
        <fieldset disabled={!isLoggedIn || pending}>
          <div className="form-group">
            <input type="password" placeholder="Current password" required value={oldPassword} onChange={this.setOldPassword}/>
            <input type="password" placeholder="New Password" required value={password1} onChange={this.setPassword1}/>
            <input type="password" placeholder="Confirm" required value={password2} onChange={this.setPassword2}/>
            <button onClick={this.changePassword} className="btn btn-primary" type="submit" disabled={!this.isValid()}>Change Password</button>
            <button onClick={this.cancel} className="btn btn-default">Cancel</button>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthUiChangePassword);
