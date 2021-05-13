import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { 
  SrvNumber,
  Directions,
} from './TaskHelpers';


const TaskListForAll = ({taskList}) => {
  const workTasks = taskList;

  
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
        <th>Инженер</th>
        <th>Due date</th>
        <th>Инициатор</th>
      </tr>
    </thead>
    <tbody>
      { workTasks && workTasks.map((wt) => {
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
                  ? <span>{wt.execution_variant.name}</span>
                  : <span className='alert alert-danger'>-</span>
                }
            </td>
            <td><SrvNumber idx={wt.id} srvNumber={wt.srv_number} /></td>
            <td>{wt.srv_title}</td>
            <td>{wt.engineer_full_name}</td>
            <td>{wt.due_date}</td>
            <td>{wt.originator.full_name}</td>
          </tr>);
        })
      }
    </tbody>
  </Table>
  );
}

export default TaskListForAll;
