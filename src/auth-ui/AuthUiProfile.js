import React, { Component } from 'react';
import {connect} from 'react-redux';

import actions from '../app.actions';

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.getIn(['authUser', 'isLoggedIn']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authUiSetAuthState: (authState) => dispatch(actions.authUiSetAuthState(authState)),
  };
};

class AuthUiProfile extends Component {

  showProfile = (e) => {
    e.preventDefault();
    this.props.authUiSetAuthState('showProfile');
  }

  render() {
    const {isLoggedIn} = this.props;

    return (
      <form>
        <div className="form-group">
          <button onClick={this.showProfile} className="btn btn-primary">Profile</button>
        </div>
      </form>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AuthUiProfile);
