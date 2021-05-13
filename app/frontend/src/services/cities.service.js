import http from './http-common';

class CitiesService {
  getAll() {
    return http.get('/search/city/');
  }

  searchByName(name) {
    return http.get(`/search/city/?search=${name}`);
  }
}

export default CitiesService;
