import {
  useState,
  useEffect,
} from 'react';
import { 
  Controller,
  useForm,
} from 'react-hook-form';
import Select from 'react-select';

import { SrvNumber } from './TaskHelpers';
import ErrorMessage from '../forms/ErrorMessage';
import TasksService from '../../services/tasks.service';
import { EmployeeService } from '../../services/employee.service';
import { Redirect } from 'react-router';


const TaskService = new TasksService();
const EngineerService = new EmployeeService();

const REQUIRED = 'Инженер должен быть выбран!';

const TaskAssignEngineer = (props) => {
  console.log(props);
  document.title = 'Назначение исполнителя задачи';
  const taskId = props.match.params.id;
  // @TODO! Load task if not passed via props.
  const taskObj = props.location.workTask;
  
  const [assigned, setAssigned] = useState(false);
  const [engineers, setEngineers] = useState([]);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const patchData = {
      engineer: data.engineer.value,
      action_type: 'assign_engineer',
    }
    TaskService.partialUpdateTask(taskId, patchData)
      .then((response) => {
        setAssigned(true);
        alert('Назначен инженер: ' + response.data.engineer_full_name)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const retriveEngineers = () => {
    console.log('Retrieve engineers!');
    EngineerService.getEngineers()
      .then((response) => {
        let engineersList = [];
        response.data.forEach(element => {
          engineersList.push(
            {
              value: element.id,
              label: element.full_name,
            }
          )
        });
        setEngineers(engineersList);
      })
      .catch((error) => {
        console.log(error);
      }
    );
  }
   
  useEffect(() => {
    retriveEngineers();
    if (taskObj.engineer) {
      setValue(
        'engineer', 
        {
          value: taskObj.engineer.id,
          label: taskObj.engineer_full_name,
        }
      )
    }
  }, [])

  return(
    <>
      { assigned
        ? <Redirect to='/' /> 
        : 
          <div className='col-md-3 m-auto'>
            {taskObj &&
              <div className='card card-container'>
                <h4 className='text-center'>
                  Назначение исполнителя на задачу <SrvNumber idx={taskObj.id} srvNumber={taskObj.srv_number} /> ({taskObj.srv_title}).
                </h4>
                <img
                  // @TODO! Img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className='profile-img-card'
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-group'>
                    <label htmlFor ='engineer'>Выберите исполнителя</label>
                      <Controller
                        render={
                          ({ field: { onChange, value } }) => (
                          <Select
                            options={engineers}
                            onChange={(e) => {
                              onChange(e);
                              }}
                            value={value}
                          />
                        )
                      }
                      name='engineer'
                      control={control}
                      rules={
                        { required: {value: true, message: REQUIRED }}
                      }
                    />
                    <ErrorMessage message={errors.engineer} />
                  </div>
                  <div className='form-group'>
                    <input 
                      type='submit'
                      value='Назначить' 
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

export default TaskAssignEngineer;