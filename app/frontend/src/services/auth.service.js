import http, { destroyToken } from './http-common';

class AuthService {
  login(email, password) {
    console.log('Logging in!');
    return http
      .post('token/obtain/', { email, password })
      .then((response) => {
          if (response.data.access) {
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      });
  }

  logout() {
    console.log('Logging out!');
    destroyToken();
  }

}

export default new AuthService();
