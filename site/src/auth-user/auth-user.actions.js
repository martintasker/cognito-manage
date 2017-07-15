var actions = {
  authUserLogin: (username, permissions) => { return { type: 'AUTH_USER_LOGIN', username, permissions }; },
  authUserLogout: () => { return { type: 'AUTH_USER_LOGOUT' }; },
  authUserSetSession: (session)=> { return { type: 'AUTH_USER_SET_SESSION', session }; },
};

export default actions;
