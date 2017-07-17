var actions = {
  authUserLogin: (username, permissions) => { return { type: 'AUTH_USER_LOGIN', username, permissions }; },
  authUserLogout: () => { return { type: 'AUTH_USER_LOGOUT' }; },
  authUserChallengeNewPassword: (username) => { return { type: 'AUTH_USER_CHALLENGE_NEW_PASSWORD', username }; },
  authUserSetSession: (session) => { return { type: 'AUTH_USER_SET_SESSION', session }; },
};

export default actions;
