import { 
  LOAD_DIRECTIONS,
  LOAD_EXECUTION_VARIANTS,
  LOAD_STATUSES,
  CLEAR_TASK_OPTIONS,
  SET_MESSAGE,
} from './types';
import TasksService from '../services/tasks.service';


const TaskService = new TasksService();

export const loadDirections = () => (dispatch) => {
  return TaskService.getDirectionsForRedux().then(
    (directionsList) => {
      dispatch({
        type: LOAD_DIRECTIONS,
        payload: { directions: directionsList },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: CLEAR_TASK_OPTIONS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
}


export const loadExecutionVariants = () => (dispatch) => {
  return TaskService.getExecutionVariantsForRedux().then(
    (evsList) => {
      dispatch({
        type: LOAD_EXECUTION_VARIANTS,
        payload: { executionVariants: evsList },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: CLEAR_TASK_OPTIONS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
}

export const loadStatuses = () => (dispatch) => {
  return TaskService.getStatusesForRedux().then(
    (statusesList) => {
      dispatch({
        type: LOAD_STATUSES,
        payload: { statuses: statusesList },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: CLEAR_TASK_OPTIONS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
}


export const clearTaskOptions = () => (dispatch) => {
  localStorage.removeItem('directions');
  localStorage.removeItem('executionVariants');
  localStorage.removeItem('statuses');

  dispatch({
    type: CLEAR_TASK_OPTIONS,
  });
}
