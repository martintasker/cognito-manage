import Immutable from 'immutable';

import reducer from './auth-user.reducer';
import actions from './auth-user.actions';

const INITIAL_STATE = Immutable.Map({
  authState: 'none',
  isLoggedIn: false,
  permissions: Immutable.Map(),
  username: '',
  session: null
});

var state;

describe('initialization tests', function() {
  it('initializes without crashing', () => {
    state = reducer();
    expect(Immutable.is(state, INITIAL_STATE)).toBe(true);
  });
});

describe('login/out tests', function() {
  it('handles AUTH_USER_LOGIN, ordinary', () => {
    state = reducer(state, actions.authUserLogin('martin'));
    expect(state.get('authState')).toBe('loggedIn');
    expect(state.get('isLoggedIn')).toBe(true);
    expect(state.getIn(['permissions', 'isEditor'])).not.toBe(true);
    expect(state.get('username')).toBe('martin');
  });
  it('handles AUTH_USER_LOGIN, new', () => {
    state = reducer(state, actions.authUserChallengeNewPassword('sarah'));
    expect(state.get('authState')).toBe('challengedNewPassword');
    expect(state.get('isLoggedIn')).toBe(false);
    expect(state.get('username')).toBe('sarah');
    state = reducer(state, actions.authUserLogin('sarah'));
    expect(state.get('authState')).toBe('loggedIn');
    expect(state.get('isLoggedIn')).toBe(true);
    expect(state.get('username')).toBe('sarah');
  });
  it('handles AUTH_USER_LOGIN, admin', () => {
    state = reducer(state, actions.authUserLogin('linda', {admin: true}));
    expect(state.get('authState')).toBe('loggedIn');
    expect(state.get('isLoggedIn')).toBe(true);
    expect(state.getIn(['permissions', 'admin'])).toBe(true);
    expect(state.get('username')).toBe('linda');
  });
  it('handles AUTH_USER_LOGIN, editor', () => {
    state = reducer(state, actions.authUserLogin('andrew', {editor: true}));
    expect(state.get('authState')).toBe('loggedIn');
    expect(state.get('isLoggedIn')).toBe(true);
    expect(state.getIn(['permissions', 'admin'])).not.toBe(true);
    expect(state.getIn(['permissions', 'editor'])).toBe(true);
    expect(state.get('username')).toBe('andrew');
  });
  it('handles AUTH_USER_LOGOUT', () => {
    state = reducer(state, actions.authUserLogout());
    expect(state.get('authState')).toBe('none');
    expect(state.get('isLoggedIn')).toBe(false);
    expect(state.getIn(['permissions', 'editor'])).not.toBe(true);
    expect(state.getIn(['permissions', 'admin'])).not.toBe(true);
    expect(state.get('username')).toBe('');
  });
  it('handles AUTH_USER_SET_SESSION', () => {
    state = reducer(state, actions.authUserSetSession({foo:'bar'}));
    expect(state.get('session')).toBeDefined();
    expect(state.get('session')).toEqual({foo:'bar'});
  });
});
