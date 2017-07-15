import Immutable from 'immutable';

const initialUserState = Immutable.Map({
  isLoggedIn: false,
  permissions: Immutable.Map(),
  username: '',
  session: null
});

export default function(state = initialUserState, action) {
  if (!action) {
    return state;
  }

  if (action.type === 'AUTH_USER_LOGIN') {
    let {username, permissions} = action;
    // permissions = permissions || {};
    return state
      .set('isLoggedIn', true)
      .set('permissions', Immutable.Map(permissions))
      .set('username', username);
  }
  
  if (action.type === 'AUTH_USER_LOGOUT') {
    return state
      .set('isLoggedIn', false)
      .set('permissions', Immutable.Map())
      .set('username', '');
  }

  if (action.type === 'AUTH_USER_SET_SESSION') {
    const {session} = action;
    return state
      .set('session', session);
  }

  return state;
}
