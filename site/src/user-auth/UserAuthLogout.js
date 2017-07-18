import React, { Component } from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.getIn(['authUser', 'isLoggedIn']),
    cognitoAuth: state.getIn(['authUser', 'session']),
  };
};

class UserAuthLogout extends Component {

  logout = (e) => {
    e.preventDefault();
    this.props.cognitoAuth.logout();
  }

  render() {
    const {isLoggedIn} = this.props;

    return (
      <form>
        <div className="form-group">
          <button onClick={this.logout} disabled={!isLoggedIn} className="btn btn-primary" type="submit">Logout</button>
        </div>
      </form>
    );
  }
}

export default connect(mapStateToProps)(UserAuthLogout);
