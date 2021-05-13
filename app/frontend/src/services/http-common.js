import axios from 'axios';
import { history } from '../helpers/history';

//@TODO! Move to .env
const API_URL = 'http://127.0.0.1:8000/api/v1/';

const accessToken = localStorage.getItem('access');
let headers = {
  'Content-type': 'application/json'
}

if (accessToken) {
  headers['Authorization'] = `Bearer ${accessToken}`;
}

const http = axios.create({
  baseURL: API_URL,
  headers: headers,
});

const destroyToken = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');  
  localStorage.removeItem('user');
}

function createAxiosResponseInterceptor(axiosInstance) {
  const refresh = localStorage.getItem('refresh');
  const interceptor = http.interceptors.response.use(
      response => response,
      error => {
          if (error.response.status !== 401) {
              return Promise.reject(error);
          }
          if (!refresh) {
            history.push('/login/');
          }
          http.interceptors.response.eject(interceptor);
          return http.post('token/refresh/', { 
            'refresh': refresh
          })
          .then(response => {
            localStorage.setItem('access', response.data.access);
            error.response.config.headers['Authorization'] = 'Bearer ' + response.data.access;
            return http(error.response.config);
          }).catch(error => {
              destroyToken();
              history.push('/login/');
              return Promise.reject(error);
          }).finally(createAxiosResponseInterceptor);
      }
  );
}

createAxiosResponseInterceptor(http);

export default http;
export { destroyToken };
