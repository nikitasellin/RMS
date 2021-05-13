import 'react-datepicker/dist/react-datepicker.css';

import React, { 
  useState,
  useEffect,
} from 'react';
import { 
  useForm,
  Controller,
} from 'react-hook-form';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import ReactDatePicker from 'react-datepicker';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import TasksService from '../../services/tasks.service';
import CitiesService from '../../services/cities.service';
import handleError from '../../helpers/errors';
import ErrorMessage from '../forms/ErrorMessage';


const ACTION = {
  createTask: {
    documentTitle: 'Добавление задачи в план',
    formTitle: 'Заполните поля',
  },
  updateTask: {
    documentTitle: 'Редактирование задачи',
    formTitle: 'Редактирование задачи',
  },
}

const REQUIRED = 'Обязательное поле';

const TaskService = new TasksService();
const CityService = new CitiesService();


const prepareData = (formData) => {
  let data = formData;
  let dd = data.due_date;
  data.due_date = `${dd.getFullYear()}-${dd.getMonth()+1}-${dd.getDate()}`;
  data.site = data.site.value;
  data.customer = data.customer.value;
  if (!data.estimated_time) {
    delete data.estimated_time;
  }
  let directions = [];
  data.directions.forEach(item => directions.push(item.value));
  data.directions = directions;
  if (!data.execution_variant) {
    delete data.execution_variant;
  } else {
    data.execution_variant = data.execution_variant.value;
  }
  return (data);
}

const TaskCreateUpdate = (props) => {
  const actionType = props.action;
  const taskId = props.match.params.id;
  const actionParams = ACTION[actionType]

  const currentUser = useSelector(state => state.auth.user);
  const directions = useSelector(state => state.taskOptions.directions);
  const executionVariants = useSelector(state => state.taskOptions.executionVariants);
  
  const [taskObj, setTaskObj] = useState();
  const [customers, setCustomers] = useState([]);
  const [sites, setSites] = useState([]);
  const [cityId, setCityId] = useState(null);
  const [customerObj, setCustomerObj] = useState();

  const [errorMessage, setErrorMessage] = useState('');
  const [pathToRedirect, setPathToRedirect] = useState(null)
  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  document.title = actionParams.documentTitle;

  const retrieveTask = (id) => {
    console.log('Retrieve task!');
    TaskService.getTask(id)
      .then((response) => {
        setTaskObj(response.data);
      })
      .catch((error) => {
        console.log(error)
      }
    );
  }

  const retrieveCustomers = () => {
    console.log('Retrieve customers');
    TaskService.getCustomers()
      .then(response => {
        let customersList = [];
        response.data.results.forEach(element => {
          customersList.push(
            {
              value: element.id,
              label: element.official_name,
            }
          )
        });
        setCustomers(customersList);
      })
      .catch(e => {
        console.log(e);
    });
  }

  const retrieveSites = () => {
    console.log('Retrieve sites');
    let params = {
      customerId: customerObj.value,
      cityId: null,
    }
    if (cityId) {
      params.cityId = cityId;
    }
    TaskService.getSites(params)
      .then(response => {
       let sitesList = [];
        response.data.results.forEach(element => {
          sitesList.push(
            {
              value: element.id,
              label: `${element.name} (${element.city.alternate_names})`,
            }
          )
        });
        setSites(sitesList);
      })
      .catch(e => {
        console.log(e);
      }
    );
  }
  
  const retrieveCities = (searchQuery) => {
    console.log('Retrieve cities');
    let citiesList = [];
    CityService.searchByName(searchQuery)
      .then(response => {
        response.data.results.forEach(element => {
          citiesList.push(
            {
              value: element.id,
              label: element.alternate_names,
            }
          )
        });
      })
      .catch(e => {
        console.log(e);
    });
    return(citiesList);
  }

  const loadCityOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(retrieveCities(inputValue));
    }, 100);
  };
  
  const onSubmit = data => {
    prepareData(data);
    if (taskObj) {
      // Update existing object
      data.city = cityId;
      data.action_type = 'full_update';
      console.log(data);
      TaskService.updateTask(taskObj.id, data)
        .then(response => {
          console.log(response.data);
          setErrorMessage('');
          alert('Задача успешно обновлена');
          setPathToRedirect(`/task/${response.data.id}/`);
        })
        .catch((error) => {
          console.log(error.response)
          setErrorMessage(handleError(error.response));
        }
      );
    } else {
      // Create new object
      TaskService.createTask(data)
        .then(response => {
          console.log(response.data);
          setErrorMessage('');
          setPathToRedirect(`/task/${response.data.id}/`);
        })
        .catch((error) => {
          console.log(error.response)
          setErrorMessage(handleError(error.response));
        }
      );
    }
  }

  useEffect(() => {
    retrieveCustomers();
    if (taskId) {
      retrieveTask(taskId);
    }
  }, []);

  useEffect(() => {
    if (taskObj) {
      console.log('Setting form values');
      const customerObj = {
        value: taskObj.site.customer.id,
        label: taskObj.customer,
      }
      let directionsValue = [];
      const taskDirections = taskObj.directions.map((direction) => { 
        directionsValue.push(
          {
            value: direction.id,
            label: direction.name,
          }
        );
      });
      let ev = null;
      if (taskObj.execution_variant) {
        ev = {
          value: taskObj.execution_variant.id,
          label: taskObj.execution_variant.name,
        }
      }

      reset({
        customer: customerObj,
        site: {
          value: taskObj.site.id,
          label: `${taskObj.site.name} (${taskObj.city})`,
        },
        directions: directionsValue,
        due_date: new Date(taskObj.due_date),
        srv_title: taskObj.srv_title,
        description: taskObj.description,
        estimated_time: taskObj.estimated_time,
        execution_variant: ev,
      });
      setCustomerObj(customerObj)
    }
  }, [taskObj]);

  useEffect(() => {
    setValue('site', null);
    if (customerObj) {
      retrieveSites();
    }
  }, [cityId, customerObj])


  return(
    <div className='col-md-3 m-auto'>
      { pathToRedirect && 
        <Redirect 
          to={{
            pathname: pathToRedirect,
            workTask: taskObj,
          }}
        />
      }
      { currentUser && currentUser.role === 'engineer'
          ? <>Redirect to 403</>
          :
            <>
              <h3 className='text-center'>
                {actionParams.formTitle} {taskObj && taskObj.srv_number}
              </h3>
              <div className='card card-container'>
                <img
                  // @TODO! Img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className='profile-img-card'
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-group'>
                    <label htmlFor='city'>Город</label>
                    <Controller render={
                      ({ field: { onChange, value } }) => (
                        <AsyncSelect
                          cacheOptions
                          isClearable
                          loadOptions={loadCityOptions}
                          defaultOptions
                          onChange={(e) => {
                            if (e) {
                              setCityId(e.value);
                            } else {
                              setCityId(null);
                            }
                          }}
                        />)
                      }
                      name='city'
                      control={control}
                      defaultValue={null}
                    />
                    <div>{errors.city?.message}</div>
                  </div>

                  <div className='form-group'>
                    <label htmlFor='customer'>Заказчик</label>
                    <Controller
                      render={
                        ({ field: { onChange, value } }) => (
                          <Select
                            options={customers}
                            onChange={(e) => {
                              setCustomerObj(e);
                              onChange(e);
                            }}
                            value={value}
                          />
                        )
                      }
                      name='customer'
                      control={control}
                      defaultValue={null}
                      rules={
                        { required: {value: true, message: REQUIRED }}
                      }
                    />
                  <ErrorMessage message={errors.customer} />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='site'>Площадка</label>
                    <Controller render={({ field: { onChange, value } }) => (
                      <Select
                        isClearable
                        options={sites}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        value={value}
                      />
                      )}
                      name='site'
                      control={control}
                      defaultValue={null}
                      rules={
                        { required: {value: true, message: REQUIRED }}
                      }
                    />
                  <ErrorMessage message={errors.site} />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='directions'>Направления</label>
                    <Controller render={({ field: { onChange, value } }) => (
                      <Select
                        isMulti
                        isClearable
                        options={directions}
                        onChange={(e) => {
                          onChange(e);
                          console.log(e);
                        }}
                        value={value}
                      />
                      )}
                      control={control}
                      defaultValue={null}
                      name='directions'
                      rules={
                        { required: {value: true, message: REQUIRED }}
                      }
                    />
                    <ErrorMessage message={errors.directions} />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='due_date'>Due date</label>
                    <Controller
                      render={({ field: { onChange, onBlur, value } }) => (
                        <ReactDatePicker
                          onChange={onChange}
                          onBlur={onBlur}
                          selected={value}
                          showWeekNumbers
                          dateFormat='yyyy-MM-dd'
                        />)
                      }
                      name='due_date'
                      control={control}
                      rules={
                        { required: {value: true, message: REQUIRED }}
                      }
                    />
                    <ErrorMessage message={errors.due_date} />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='srv_title'>Название запроса</label>
                    <input
                      type='text'
                      className='form-control'
                      {...register(
                          'srv_title',
                          { required: {value: true, message: REQUIRED }}
                        )
                      }
                    />
                    <ErrorMessage message={errors.srv_title} />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='description'>Состав работ</label>
                    <textarea 
                      className='form-control'
                      {...register(
                          'description',
                          { required: {value: true, message: REQUIRED }}
                        )
                      }
                    />
                    <ErrorMessage message={errors.description} />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='estimated_time'>Ожидаемые трудозатраты, ч.</label>
                    <input
                      className='form-control'
                      type='number'
                      step='0.01'
                      {...register(
                        'estimated_time', 
                          { min: 
                            { value: 0, 
                              message: 'Значение должно быть >= 0'
                            }, 
                          max: 
                            { value: 40, 
                              message: 'Значение должно быть <= 40'
                            }
                          }
                        )
                      }
                    /> 
                  </div>
                  {errors.estimated_time &&
                    <div className='form-group alert-danger'>
                      {errors.estimated_time.message}
                    </div>
                  }
                  <div className='form-group'>
                    <label htmlFor='execution_variant'>Особенности исполнения</label>
                      <Controller render={({ field: { onChange, value } }) => (
                        <Select
                          isClearable
                          options={executionVariants}
                          onChange={(e) => {
                            onChange(e);
                            console.log(e);
                          }}
                          value={value}
                        />
                        )}
                        control={control}
                        defaultValue={null}
                        name='execution_variant'
                    />
                    <ErrorMessage message={errors.execution_variant} />
                  </div>
                  {errorMessage && (
                    <div className='form-group'>
                      <div className='alert alert-danger' role='alert'>
                        {errorMessage}
                      </div>
                    </div>
                  )}
                  <div className='form-group'>
                    <input 
                      type='submit'
                      value='Сохранить'
                      className='btn btn-dark btn-block'
                    />
                  </div>
                </form>
              </div>
            </>
      }
    </div>
  );
}


export default TaskCreateUpdate;
