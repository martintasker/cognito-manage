var actions = {
  authUiSetMessage: (message) => { return { type: 'AUTH_UI_SET_MESSAGE', message }; },
  authUiSetAuthState: (authState) => { return { type: 'AUTH_UI_SET_AUTH_STATE', authState }; },
};

export default actions;
