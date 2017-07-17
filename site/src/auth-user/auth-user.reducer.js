import Immutable from 'immutable';

const initialUserState = Immutable.Map({
  authState: 'none',
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
    const {username, permissions} = action;
    return state
      .set('authState', 'loggedIn')
      .set('isLoggedIn', true)
      .set('permissions', Immutable.Map(permissions))
      .set('username', username);
  }

  if (action.type === 'AUTH_USER_LOGOUT') {
    return state
      .set('authState', 'none')
      .set('isLoggedIn', false)
      .set('permissions', Immutable.Map())
      .set('username', '');
  }

  if (action.type === 'AUTH_USER_CHALLENGE_NEW_PASSWORD') {
    const {username} = action;
    return state
      .set('authState', 'challengedNewPassword')
      .set('isLoggedIn', false)
      .set('permissions', Immutable.Map())
      .set('username', username);
  }

  if (action.type === 'AUTH_USER_SET_SESSION') {
    const {session} = action;
    return state
      .set('session', session);
  }

  return state;
}
