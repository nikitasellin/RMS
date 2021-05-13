import { 
  Table,
  Button 
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { 
  SrvNumber,
  Directions,
  Status,
} from './TaskHelpers';
import TasksService from '../../services/tasks.service';


const TaskService = new TasksService();


const TaskListForAdmin = ({taskList}) => {
  const workTasks = taskList;

  const statuses = useSelector(state => state.taskOptions.statuses);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm('Подтвердите удаление задачи номер ' + e.target.srvNumber.value)) {
      TaskService.deleteTask(e.target.id.value)
        .then((response) => {
          alert('Задача успешно удалена');
          window.location.reload();;
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }
  
  return(
    <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>Рабочая неделя</th>
        <th>Город</th>
        <th>Принимающая организация</th>
        <th>Направление</th>
        <th>Особенности исполнения</th>
        <th>Номер запроса</th>
        <th>Название запроса</th>
        <th>Статус</th>
        <th>Инженер</th>
        <th>Due date</th>
        <th>Инициатор</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      { workTasks.map((wt) => {
        return(
          <tr key={wt.id}>
            <td>
              <Link to={'/task/schedule/' + wt.iso_week + '/'}>
                {wt.iso_week}
              </Link>
            </td>
            <td>{wt.site.city.alternate_names}</td>
            <td>{wt.site.customer.official_name}</td>
            <td><Directions values={wt.directions} /></td>
            <td>{wt.execution_variant
                  ? 
                    <p>
                      {wt.execution_variant.name}<br/>
                      { wt.execution_variant.need_engineer &&
                        <small>
                          <Link to={
                            {
                              pathname: '/task/assign-engineer/' + wt.id + '/',
                              workTask: wt,
                            }
                          }>
                            Назначить/заменить инженера
                          </Link>
                        </small>
                      }
                    </p>
                  : 
                    <Link to={
                      {
                        pathname: '/task/change-execution-variant/' + wt.id + '/',
                        workTask: wt,
                      }
                      }>
                       <span className='alert alert-danger'>-</span>
                    </Link>                      
                }
            </td>
            <td><SrvNumber idx={wt.id} srvNumber={wt.srv_number} /></td>
            <td>{wt.srv_title}</td>
            <td>
              <Link to={
                {
                  pathname: '/task/change-status/' + wt.id + '/',
                  workTask: wt,
                }
              }>
                <Status idx={wt.status} statusList={statuses} />
              </Link>
            </td>
            <td>{wt.engineer_full_name}</td>
            <td>
              {wt.due_date} <Link to={
                              {
                                pathname: '/task/change-due-date/' + wt.id + '/',
                                workTask: wt,
                              }
                            }>
                              (изменить)
                            </Link>
            </td>
            <td>{wt.originator.full_name}</td>
            <td>
              <Link to={'/task/update/' + wt.id + '/'} className='btn btn-sm btn-dark'>Edit</Link> 
              <form onSubmit={handleSubmit}>
                <input type='hidden' name='id' value={wt.id} />
                <input type='hidden' name='srvNumber' value={wt.srv_number} />
                <Button 
                  variant='danger'
                  size='sm'
                  type='submit'
                >
                  Del
                </Button>
              </form>
            </td>
          </tr>);
        })
      }
    </tbody>
  </Table>
  );
}

export default TaskListForAdmin;
