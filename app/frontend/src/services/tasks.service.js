import http from './http-common';


const createList = (responseData) => {
  let outList = [];
  responseData.forEach(element => {
    outList.push(
    {
      value: element.id,
      label: element.name,
    });
  });
  return(outList);
}


class TasksService {
  getAllTasks() {
    return http.get('/tasks/work-tasks/');
  }

  getTasksByPageNumber(number) {
    return http.get(`/tasks/work-tasks/?page=${number}`);
  }

  getTasksByIsoWeek(isoWeek) {
    return http.get(`/tasks/work-tasks/?iso_week=${isoWeek}`);
  }

  getAssignedTasks() {
    return http.get('/tasks/assigned-tasks/');
  }

  createTask(data) {
    return http.post('/tasks/work-tasks/', data);
  }

  updateTask(id, data) {
    return http.put(`/tasks/work-tasks/${id}/`, data);
  }

  partialUpdateTask(id, data) {
    return http.patch(`/tasks/work-tasks/${id}/`, data);
  }

  getTask(id) {
    return http.get(`/tasks/work-tasks/${id}/`);
  }

  getDirections(id) {
    return http.get('/tasks/directions/');
  }

  getDirectionsForRedux() {
    return http
      .get('/tasks/directions/')
      .then((response) => {
        console.log('Get directions for redux');
        let directionsList = [];
        if (response.data.results) {
          directionsList = createList(response.data.results);
          localStorage.setItem('directions', directionsList);
        }
        return directionsList;
    });
  }

  getExecutionVariants() {
    return http.get('/tasks/execution-variants/');
  }

  getExecutionVariantsForRedux() {
    return http
      .get('/tasks/execution-variants/')
      .then((response) => {
        console.log('Get execution variants for redux');
        let evsList = [];
        if (response.data.results) {
          evsList = createList(response.data.results)
          localStorage.setItem('executionVariants', evsList);
        }
        return evsList;
    });
  }

  getStatusesForRedux() {
    return http
      .get('/tasks/statuses/')
      .then((response) => {
        console.log('Get statuses for redux');
        let statusList = [];
        if (response.data) {
          statusList = createList(response.data)
          localStorage.setItem('statuses', statusList);
        }
        return statusList;
    });
  }

  getCustomers() {
    return http.get('/customers/customers/');
  }

  getSites(props) {
    return http.get(`customers/sites/?customer_id=${props.customerId}&city_id=${props.cityId}`);
  }

  deleteTask(id) {
    return http.delete(`/tasks/work-tasks/${id}/`);
  }

  // deleteAll() {
  //   return http.delete('/tasks/work-tasks/');
  // }
}

export default TasksService;
