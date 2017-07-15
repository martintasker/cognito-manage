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
    }
  }

  usernameChange = (e) => {
    this.setState({username: e.target.value});
  }

  passwordChange = (e) => {
    this.setState({password: e.target.value});
  }

  login = (e) => {
    e.preventDefault();
    const {username, password} = this.state;
    this.setState({password: ''});
  }

  render() {
    const {isLoggedIn} = this.props;
    const {username, password} = this.state;

    return (
      <form>
        <fieldset disabled={isLoggedIn}>
          <div className="form-group">
            <input type="text" name="username" placeholder="User name" required value={username}/>
            <input type="password" name="password" placeholder="Password" required value={password}/>
            <button onClick={this.login} className="btn btn-primary" type="submit">Login</button>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default connect(mapStateToProps)(UserAuthLogin);
