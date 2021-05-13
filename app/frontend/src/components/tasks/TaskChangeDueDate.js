import 'react-datepicker/dist/react-datepicker.css';

import {
  useState,
  useEffect,
} from 'react';
import { 
  Controller,
  useForm,
} from 'react-hook-form';
import ReactDatePicker from 'react-datepicker';
import { Redirect } from 'react-router';

import { SrvNumber } from './TaskHelpers';
import ErrorMessage from '../forms/ErrorMessage';
import TasksService from '../../services/tasks.service';


const TaskService = new TasksService();

const REQUIRED = 'Дата должна быть указана!';

const TaskChangeDueDate = (props) => {
  console.log(props);
  document.title = 'Смена статуса задачи';
  const taskId = props.match.params.id;
  // @TODO! Load task if not passed via props
  const taskObj = props.location.workTask;
  
  const [newDueDate, setNewDueDate] = useState()
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    let dd = data.due_date;
    const patchData = {
      due_date: `${dd.getFullYear()}-${dd.getMonth()+1}-${dd.getDate()}`,
      action_type: 'change_due_date',
    }
    TaskService.partialUpdateTask(taskId, patchData)
      .then((response) => {
        setNewDueDate(response.data.due_date);
        alert('Новая плановая дата: ' + response.data.due_date)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    if (taskObj) {  
        setValue('due_date', new Date(taskObj.due_date));
      }
    }, [taskObj]
  )

  return(
    <>
      { newDueDate
        ? <Redirect to='/' /> 
        : 
          <div className='col-md-3 m-auto'>
            {taskObj &&
              <div className='card card-container'>
                <h4 className='text-center'>
                  Изменение плановой даты выполнения задачи <SrvNumber idx={taskObj.id} srvNumber={taskObj.srv_number} /> ({taskObj.srv_title}).
                </h4>
                <img
                  // @TODO! Img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className='profile-img-card'
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-group'>
                    <label htmlFor ='due_date'>Выберите новую дату:</label>
                    <Controller
                      render={({ field: { onChange, onBlur, value } }) => (
                        <ReactDatePicker
                          className='form-control'
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

export default TaskChangeDueDate;
