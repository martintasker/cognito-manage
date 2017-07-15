import Immutable from 'immutable';

const initialAppState = Immutable.Map({
});

export default function(state = initialAppState, action) {
  if (!action) {
    return state;
  }

  return state;
}
