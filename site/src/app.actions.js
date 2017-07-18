import authUserActions from './auth-user/auth-user.actions';
import loginUiActions from './auth-ui/auth-ui.actions';

var actions = {
  ...authUserActions,
  ...loginUiActions,
};

export default actions;
