import Immutable from 'immutable';

import authUserReducer from './auth-user/auth-user.reducer';

const initialAppState = Immutable.Map({
  authUser: authUserReducer(),
});

export default function(state = initialAppState, action) {
  if (!action) {
    return state;
  }

  state = state.updateIn(['authUser'], state => authUserReducer(state, action));

  return state;
}
