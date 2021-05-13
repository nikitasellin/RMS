import {
  useState,
  useEffect,
} from 'react';
import { 
  Controller,
  useForm,
} from 'react-hook-form';
import Select from 'react-select';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import { SrvNumber } from './TaskHelpers';
import ErrorMessage from '../forms/ErrorMessage';
import TasksService from '../../services/tasks.service';


const TaskService = new TasksService();

const REQUIRED = 'Вариант должен быть выбран!';

const TaskChangeEV = (props) => {
  console.log(props);
  document.title = 'Выбор варианта выполнения задачи';
  const taskId = props.match.params.id;
  // @TODO! Load task if not passed via props
  const taskObj = props.location.workTask;
  
  const executionVariants = useSelector(state => state.taskOptions.executionVariants);
  const [newVariant, setNewVariant] = useState()
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const patchData = {
      'execution_variant': data.execution_variant.value,
      action_type: 'change_execution_variant',
    }
    TaskService.partialUpdateTask(taskId, patchData)
      .then((response) => {
        setNewVariant(response.data.execution_variant);
        alert('Вариант выполения задачи: ' + response.data.execution_variant.name)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return(
    <>
      { newVariant
        ? <Redirect to='/' /> 
        : 
          <div className='col-md-3 m-auto'>
            {taskObj &&
              <div className='card card-container'>
                <h4 className='text-center'>
                  Изменения варианта выполнения задачи <SrvNumber idx={taskObj.id} srvNumber={taskObj.srv_number} /> ({taskObj.srv_title}).
                </h4>
                <img
                  // @TODO! Img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className='profile-img-card'
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-group'>
                    <label htmlFor ='execution_variant'>Выберите вариант</label>
                      <Controller
                        render={
                          ({ field: { onChange, value } }) => (
                          <Select
                            options={executionVariants}
                            onChange={(e) => {
                              onChange(e);
                              }}
                            value={value}
                          />
                        )
                      }
                      name='execution_variant'
                      control={control}
                      rules={
                        { required: {value: true, message: REQUIRED }}
                      }
                    />
                    <ErrorMessage message={errors.execution_variant} />
                  </div>
                  <div className='form-group'>
                    <input
                      type='submit'
                      value='Выбрать' 
                      className='btn btn-dark btn-block'
                    />
                  </div>
                </form>
              </div>
            }
          </div>
      } 
    </>
  );
}

export default TaskChangeEV;