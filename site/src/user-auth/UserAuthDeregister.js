import React, { Component } from 'react';
import {connect} from 'react-redux';

import actions from '../app.actions';

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.getIn(['authUser', 'isLoggedIn']),
    cognitoAuth: state.getIn(['authUser', 'session']),
  };
};

class UserAuthDeregister extends Component {

  deregister = (e) => {
    e.preventDefault();
    this.props.cognitoAuth.deregister();
  }

  render() {
    const {isLoggedIn} = this.props;

    return (
      <form>
        <div className="form-group">
          <button onClick={this.deregister} disabled={!isLoggedIn} className="btn btn-danger" type="submit">Deregister</button>
        </div>
      </form>
    );
  }
}

export default connect(mapStateToProps)(UserAuthDeregister);
