import Immutable from 'immutable';

import authUserReducer from './auth-user/auth-user.reducer';
import loginUiReducer from './user-auth/login-ui.reducer';

const initialAppState = Immutable.Map({
  authUser: authUserReducer(),
  loginUi: loginUiReducer(),
});

export default function(state = initialAppState, action) {
  if (!action) {
    return state;
  }

  state = state.updateIn(['authUser'], state => authUserReducer(state, action));
  state = state.updateIn(['loginUi'], state => loginUiReducer(state, action));

  return state;
}
