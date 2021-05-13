import {
  useState,
  useEffect,
} from 'react';
import { Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import TasksService from '../../services/tasks.service';
import ErrorMessage from '../forms/ErrorMessage';
import { SrvNumber } from '../tasks/TaskHelpers';
import ReportWrite from '../reports/ReportWrite';


const TaskService = new TasksService();
const REQUIRED = 'Не выбрано ни одной задчи для отчёта!';

const AssignedTasks = () => {
  document.title = 'Мои задачи';

  const [assignedTasks, setAssignedTasks] = useState([]);
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm();
  const [tasksForReport, setTasksForReport] = useState([]);

  const onSubmit = (data) => {
    const filteredAssignedTasks = assignedTasks.filter(task => {
      const taskId = String(task.id);
      return (data.tasks.includes(taskId));
    });
    setTasksForReport(filteredAssignedTasks);
  }

  const retrieveAssignedTasks = () => {
    console.log('Retrieve tasks!');
    TaskService.getAssignedTasks()
      .then((response) => {
        setAssignedTasks(response.data.results);
      })
      .catch((error) => {
        console.log(error)
      }
    );
  }
  
  useEffect(() => {
    retrieveAssignedTasks();
  }, [])

  return(
    <> 
      { isSubmitSuccessful
          ? <ReportWrite forReport={tasksForReport} />
          :
            <form onSubmit={handleSubmit(onSubmit)}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Включить в отчёт</th>
                    <th>Номер запроса</th>
                    <th>Название запроса</th>
                    <th>Due date</th>
                    <th>Оригинатор</th>
                  </tr>
                </thead>
                <tbody>
                  { assignedTasks.map((wt) => {
                      return(
                        <tr key={wt.id}>
                          <td>
                            { !wt.have_report &&
                                <input type='checkbox'
                                  value={wt.id}
                                  name='tasks'
                                  {...register(
                                      'tasks',
                                      { required: {value: true, message: REQUIRED }}
                                    )
                                  }
                                /> 
                            }
                          </td>
                          <td><SrvNumber idx={wt.id} srvNumber={wt.srv_number} /></td>
                          <td>{wt.srv_title}</td>
                          <td>{wt.due_date}</td>
                          <td>{wt.originator.full_name}</td>
                        </tr>);
                      })
                    }
                </tbody>
              </Table>
              <ErrorMessage message={errors.tasks} />
              <input 
                type='submit'
                value='Написать отчёт' 
                className='btn btn-dark btn-block'
              />
            </form>
      }
    </>  
  );
}


export default AssignedTasks;
