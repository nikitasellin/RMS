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

const REQUIRED = 'Статус должен быть указан!';

const TaskChangeStatus = (props) => {
  console.log(props);
  document.title = 'Смена статуса задачи';
  const taskId = props.match.params.id;
  // @TODO! Load task if not passed via props
  const taskObj = props.location.workTask;
  
  const statuses = useSelector(state => state.taskOptions.statuses);
  const [newStatus, setNewStatus] = useState()
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const patchData = {
      status: data.status.value,
      action_type: 'change_status',
    }
    TaskService.partialUpdateTask(taskId, patchData)
      .then((response) => {
        setNewStatus(response.status);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    if (taskObj) {  
      statuses.forEach((status) => { 
        if (status.value === taskObj.status) {
            setValue('status', status);
          }
        });
      }
    }, [taskObj]
  )

  return(
    <>
      { newStatus
        ? <Redirect to='/' /> 
        : 
          <div className='col-md-3 m-auto'>
            {taskObj &&
              <div className='card card-container'>
                <h4 className='text-center'>
                  Изменение статуса задачи <SrvNumber idx={taskObj.id} srvNumber={taskObj.srv_number} /> ({taskObj.srv_title}).
                </h4>
                <img
                  // @TODO! Img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className='profile-img-card'
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-group'>
                    <label htmlFor ='status'>Укажите статус</label>
                      <Controller
                        render={
                          ({ field: { onChange, value } }) => (
                          <Select
                            options={statuses}
                            onChange={(e) => {
                              onChange(e);
                              }}
                            value={value}
                          />
                        )
                      }
                      name='status'
                      control={control}
                      rules={
                        { required: {value: true, message: REQUIRED }}
                      }
                    />
                    <ErrorMessage message={errors.status} />
                  </div>
                  <div className='form-group'>
                    <input
                      type='submit'
                      value='Установить' 
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

export default TaskChangeStatus;