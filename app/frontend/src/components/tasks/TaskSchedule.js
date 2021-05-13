import {
  useState,
  useEffect,
} from 'react';

import { SrvNumber } from './TaskHelpers';
import TasksService from '../../services/tasks.service';


const TaskService = new TasksService();


const TaskSchedule = (props) => {
  document.title = 'График задач на неделю';

  const isoWeek = props.match.params.isoWeek;
  const [workTasks, setWorkTasks] = useState([]);

  const retrieveWorkTasks = () => {
    console.log('Retrieve tasks.');
    TaskService.getTasksByIsoWeek(isoWeek)
      .then((response) => {
        setWorkTasks(response.data.results);
      })
      .catch((error) => console.log(error));
    }
  
  useEffect(() => {
    retrieveWorkTasks();
    }, []
  )

  return (
    <>
      <h3>График рабочих задач на неделе <b>{isoWeek}.</b></h3>
      { workTasks.length > 0
        ? <ul>
            { workTasks.map((wt) => {
                return(
                  <li><SrvNumber idx={wt.id} srvNumber={wt.srv_number} /> | г. {wt.city} ({wt.site.name}) | {wt.customer} | {wt.execution_variant ? wt.execution_variant.name : 'Не выбран'} | инженер: {wt.engineer_full_name}
                  </li>
                );}
              )
            }
          </ul>
        : <div className='alert-danger'>Задачи не найдены!</div>
      }
    </>
  );
}


export default TaskSchedule;
