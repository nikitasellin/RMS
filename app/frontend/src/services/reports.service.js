import http from './http-common';

class ReportsService {
  getAllReports() {
    return http.get('/reports/reports-read/');
  }

  getReportsByPageNumber(number) {
    return http.get(`/reports/reports-read/?page=${number}`);
  }

  createReport(data) {
    return http.post('/reports/reports-write/', data);
  }

  getReport(id) {
    return http.get(`/reports/reports-read/${id}/`);
  }
}

export default ReportsService;
