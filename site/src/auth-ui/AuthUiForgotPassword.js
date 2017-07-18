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
  };
};

class AuthUiForgotPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      pending: false,
    }
  }

  setUsername = (e) => {
    this.setState({username: e.target.value});
  }

  requestNewPasswordCode = async(e) => {
    e.preventDefault();
    const {username} = this.state;
    const {cognitoAuth, authUiSetMessage} = this.props;

    this.setState({
      pending: true,
    });
    authUiSetMessage('');

    return cognitoAuth.requestNewPasswordCode(username)
    .then(() => {
      console.log("requested new password");
      this.setState({pending: false});
    })
    .catch((reason) => {
      console.error("error requesting password", reason);
      this.setState({pending: false});
      authUiSetMessage(reason);
    });
  }

  cancel = (e) => {
    e.preventDefault();
    this.props.authUiSetMessage('');
    this.setState({username: ''});
  }

  isValid = () => {
    const {username} = this.state;
    return !!username;
  }

  render() {
    const {isLoggedIn} = this.props;
    const {username, pending} = this.state;

    return (
      <form>
        <fieldset disabled={isLoggedIn || pending}>
          <div className="form-group">
            <input type="text" placeholder="User name" required value={username} onChange={this.setUsername}/>
            <button onClick={this.requestNewPasswordCode} className="btn btn-primary" disabled={!this.isValid()} type="submit">Request New Password</button>
            <button onClick={this.cancel} className="btn btn-default">Cancel</button>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AuthUiForgotPassword);
