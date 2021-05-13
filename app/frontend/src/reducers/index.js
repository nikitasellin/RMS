import { combineReducers } from 'redux';
import auth from './auth';
import message from './message';
import taskOptions from './taskOptions';

export default combineReducers({
  auth,
  message,
  taskOptions,
});
