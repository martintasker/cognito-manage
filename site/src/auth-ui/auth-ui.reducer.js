import Immutable from 'immutable';

const initialUserState = Immutable.Map({
  message: '',
  authState: 'neutral',
});

export default function(state = initialUserState, action) {
  if (!action) {
    return state;
  }

  if (action.type === 'AUTH_UI_SET_MESSAGE') {
    const {message} = action;
    return state
      .set('message', message);
  }

  if (action.type === 'AUTH_UI_SET_AUTH_STATE') {
    const {authState} = action;
    return state
      .set('authState', authState);
  }

  return state;
}
