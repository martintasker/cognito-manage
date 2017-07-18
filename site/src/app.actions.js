import authUserActions from './auth-user/auth-user.actions';
import authUiActions from './auth-ui/auth-ui.actions';

var actions = {
  ...authUserActions,
  ...authUiActions,
};

export default actions;
