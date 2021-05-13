import http from './http-common';

class EmployeeService {
  getAll() {
    return http.get('/employee/accounts-read/');
  }

  getEmployee(id) {
    return http.get(`/employee/employee/accounts-read/${id}/`);
  }

  getEngineers() {
    return http.get('/employee/accounts-read/?can_be_performer=True');
  }

  create(data) {
    return http.post('/employee/accounts-write/', data);
  }
}


class EmployeeGroupService {
  getAll() {
    return http.get('/employee/groups/');
  }

  read(id) {
    return http.get(`/employee/groups/${id}`);
  }
}


export { 
  EmployeeService,
  EmployeeGroupService,
};
