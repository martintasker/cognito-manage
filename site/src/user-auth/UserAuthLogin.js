import React, { Component } from 'react';
import {connect} from 'react-redux';

import actions from '../app.actions';

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.getIn(['authUser', 'isLoggedIn']),
    cognitoAuth: state.getIn(['authUser', 'session']),
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
    this.setState({
      password: '',
      pending: true,
    });

    return this.props.cognitoAuth.login(username, password)
    .then(() => {
      console.log("logged in");
      this.setState({pending: false});
    })
    .catch((reason) => {
      console.log("error logging in", reason);
      this.setState({pending: false});
      // todo: handle errors
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

export default connect(mapStateToProps)(UserAuthLogin);
