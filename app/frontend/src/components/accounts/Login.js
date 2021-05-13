import React from 'react';
import { Redirect } from 'react-router-dom';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';

import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import requiredField from '../forms/validators';


class Login extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
      loading: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    document.title = 'Авторизация';
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      loading: true,
    });

    this.form.validateAll();

    const { dispatch, history } = this.props;

    if (this.checkBtn.context._errors.length === 0) {
      dispatch(login(this.state.email, this.state.password))
        .then(() => {
          history.push('/employee/homepage/');
          window.location.reload();
        })
        .catch(() => {
          this.setState({
            loading: false
          });
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { isLoggedIn, message } = this.props;

    if (isLoggedIn) {
      return <Redirect to='/employee/homepage/' />;
    }

    return (
      <div className='col-md-3 m-auto'>
        <h3 className='text-center'>
          Авторизация
        </h3>
        <div className='card card-container'>
          <img
            // @TODO! Img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className='profile-img-card'
          />

          <Form
            onSubmit={this.handleLogin}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className='form-group'>
              <label htmlFor='email'>E-mail</label>
              <Input
                type='text'
                className='form-control'
                name='email'
                value={this.state.email}
                onChange={this.onChangeEmail}
                validations={[requiredField]}
                disabled={this.state.loading}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Пароль</label>
              <Input
                type='password'
                className='form-control'
                name='password'
                value={this.state.password}
                onChange={this.onChangePassword}
                validations={[requiredField]}
                disabled={this.state.loading}
              />
            </div>

            <div className='form-group'>
              <button
                className='btn btn-dark btn-block'
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className='spinner-border spinner-border-sm'></span>
                )}
                <span>Войти</span>
              </button>
            </div>

            {message && (
              <div className='form-group'>
                <div className='alert alert-danger' role='alert'>
                  {message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: 'none' }}
              ref={(c) => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn, user } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    user,
    message,
  };
}

export default connect(mapStateToProps)(Login);
