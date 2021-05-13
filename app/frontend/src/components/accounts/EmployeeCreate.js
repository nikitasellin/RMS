import React, { 
  useState,
  useEffect,
} from 'react';
import { Redirect } from 'react-router';
import { useForm } from 'react-hook-form';

import { 
  EmployeeService,
  EmployeeGroupService 
} from '../../services/employee.service';
import requiredField from '../forms/validators';
import CityField from '../forms/fields/CityField';
import handleError from '../../helpers/errors';


const GroupService = new EmployeeGroupService();

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  
  useEffect(() => {
    retrieveGroups();
  }, []);
  
  const retrieveGroups = () => {
    GroupService.getAll()
      .then(response => {
        setGroups(response.data);
      })
      .catch(e => {
        console.log(e);
    });
  };

  return(
    <>
      {groups &&
        groups.map(group => (
          <option 
            value={group.id}
            key={group.id}
          >
            {group.description}
          </option>
        ))
      }
    </>
  );
}

const AccountService = new EmployeeService();

const EmployeeCreate = () => {
  document.title = 'Создание нового сотрудника';

  const [cityRef] = useState(React.createRef());
  const [errorMessage, setErrorMessage] = useState('');
  const [created, setCreated] = useState();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => {
    if (cityRef.current.state.selected.length === 1) {
      data.city = cityRef.current.state.selected[0].id;
    }
    AccountService.create(data)
      .then(response => {    
          setCreated('/employee/list/');
          setErrorMessage('');
          alert('Успешно создан пользователь ' + response.data.full_name);
        }
      )
      .catch((error) => {
          // @TODO! Move all error to axios interceptor and Redux 'message'.
          console.log(error.response);
          setErrorMessage(handleError(error.response));
        }
      );
  }

  return (
    <div className='col-md-3 m-auto'>
      { created && 
        <Redirect to={created} />
      }
      <h3 className='text-center'>
        Новый сотрудник
      </h3>
      <div className='card card-container'>
        <img
          // @TODO! Change img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className='profile-img-card'
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group'>
            <label htmlFor='last_name'>Фамилия</label>
            <input
              className='form-control'
              placeholder='Борменталь'
              {...register(
                  'last_name',
                  { required: true }
                )
              }
            />
            {errors.last_name &&               
              <div className='form-group'>
                {requiredField('')}
              </div>
            }
          </div>
          <div className='form-group'>
            <label htmlFor='first_name'>Имя</label>
            <input 
              className='form-control'
              placeholder='Иван'
              {...register(
                  'first_name',
                  { required: true }
                )
              }
            />
            {errors.first_name &&               
              <div className='form-group'>
                {requiredField('')}
              </div>
            }
          </div>
          <div className='form-group'>
            <label htmlFor='middle_name'>Очество</label>
            <input 
              className='form-control'
              placeholder='Арнольдович'
              {...register(
                  'middle_name',
                  { required: true }
                )
              }
            />
            {errors.middle_name &&               
              <div className='form-group'>
                {requiredField('')}
              </div>
            }
          </div>
          <div className='form-group'>
            <label htmlFor='group'>Группа</label>
            <select
              className='form-control'
              {...register('group')}
            >
              <GroupList />
            </select>
            {errors.group &&               
              <div className='form-group'>
                {requiredField('')}
              </div>
            }
          </div>
          <div className='form-group'>
            <label htmlFor='can_be_performer' className='align-bottom'>Может быть исполнителем&nbsp;</label>
            <input
              className='inline align-top'
              type='checkbox'
              {...register(
                  'can_be_performer',
                )
              }
            />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>E-mail</label>
            <input 
              className='form-control'
              type='email'
              placeholder='user@selin.com.ru'
              {...register(
                  'email',
                  { required: true }
                )
              }
            />
            {errors.email &&               
              <div className='form-group'>
                {requiredField('')}
              </div>
            }
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Пароль</label>
            <input 
              className='form-control'
              type='password'
              {...register(
                  'password',
                  { required: true }
                )
              } 
            />
            {errors.password &&               
              <div className='form-group'>
                {requiredField('')}
              </div>
            }
          </div>
          <div className='form-group'>
            <label htmlFor='phone_number'>Номер телефона</label>
            <input
              className='form-control'
              {...register(
                  'phone_number',
                )
              } 
            />
          </div>
          <div className='form-group'>
            <label htmlFor='city'>Город</label>
            <CityField ref={cityRef} />
          </div>
          <div className='form-group'>
            <input 
              type='submit'
              value='Создать' 
              className='btn btn-dark btn-block'
            />
          </div>
          {errorMessage && (
            <div className='form-group'>
              <div className='alert alert-danger' role='alert'>
                {errorMessage}
              </div>
            </div>
            )
          }
        </form>
      </div>
    </div>
  );
}

export default EmployeeCreate;
