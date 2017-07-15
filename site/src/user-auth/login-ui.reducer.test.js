import Immutable from 'immutable';

import reducer from './login-ui.reducer';
import actions from './login-ui.actions';

const INITIAL_STATE = Immutable.Map({
  message: '',
});

var state;

describe('initialization tests', function() {
  it('initializes without crashing', () => {
    state = reducer();
    expect(Immutable.is(state, INITIAL_STATE)).toBe(true);
  });
});

describe('functionality tests', function() {
  it('handles LOGIN_UI_SET_MESSAGE', () => {
    state = reducer(state, actions.loginUiSetMessage('boo!'));
    expect(state.get('message')).toBe('boo!');
    state = reducer(state, actions.loginUiSetMessage(''));
    expect(!state.get('message')).toBe(true);
  });
});
