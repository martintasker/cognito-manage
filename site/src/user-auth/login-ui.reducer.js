import Immutable from 'immutable';

const initialUserState = Immutable.Map({
  message: '',
});

export default function(state = initialUserState, action) {
  if (!action) {
    return state;
  }

  if (action.type === 'LOGIN_UI_SET_MESSAGE') {
    const {message} = action;
    return state
      .set('message', message);
  }

  return state;
}
