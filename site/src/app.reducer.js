import Immutable from 'immutable';

import authUserReducer from './auth-user/auth-user.reducer';
import authUiReducer from './auth-ui/auth-ui.reducer';

const initialAppState = Immutable.Map({
  authUser: authUserReducer(),
  authUi: authUiReducer(),
});

export default function(state = initialAppState, action) {
  if (!action) {
    return state;
  }

  state = state.updateIn(['authUser'], state => authUserReducer(state, action));
  state = state.updateIn(['authUi'], state => authUiReducer(state, action));

  return state;
}
