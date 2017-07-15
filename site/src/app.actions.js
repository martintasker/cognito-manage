import authUserActions from './auth-user/auth-user.actions';
import loginUiActions from './user-auth/login-ui.actions';

var actions = {
  ...authUserActions,
  ...loginUiActions,
};

export default actions;
