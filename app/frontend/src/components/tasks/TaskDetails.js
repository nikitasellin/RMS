import { 
  useState,
  useEffect,
} from 'react';
import { 
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TasksService from '../../services/tasks.service';


const TaskService = new TasksService();

const TaskDetails = (props) => {
  document.title = 'Детали задачи';
  const taskId = props.match.params.id;

  const [taskObj, setTaskObj] = useState(null);

  const retrieveTask = (id) => {
    console.log('Retrieve task!');
    TaskService.getTask(id)
      .then((response) => {
        console.log(response.data);
        setTaskObj(response.data);
      })
      .catch((error) => {
        console.log(error)
      }
    );
  }
  
  useEffect(() => {
    retrieveTask(taskId);
  }, [])

  return(
    <div className='col-md-8 m-auto'>
      { taskObj
        ? <div>
            <h2 className='text-center'>Детальная информация о задаче</h2>
            <Row>
              <Col md={4}><b>Название запроса</b></Col>
              <Col md={3}><b>Город</b></Col>
              <Col md={3}><b>Заказчик</b></Col>
              <Col md={2}><b>Площадка</b></Col>
            </Row>
            <Row>
              <Col md={4}>{taskObj.srv_title}</Col>
              <Col md={3}>{taskObj.city}</Col>
              <Col md={3}>{taskObj.customer}</Col>
              <Col md={2}>{taskObj.site.name}</Col>
            </Row>
            <hr />
            <Row>
              <Col md={2}><b>Номер запроса</b></Col>
              <Col md={2}><b>Due date</b></Col>
              <Col md={1}><b>Статус</b></Col>
              <Col md={3}><b>Оригинатор</b></Col>
              <Col md={3}><b>Инженер</b></Col>
              <Col md={1}><b>Отчет</b></Col>
            </Row>
            <Row>
              <Col md={2}>{taskObj.srv_number}</Col>
              <Col md={2}>{taskObj.due_date}</Col>
              <Col md={1}>{taskObj.status}</Col>
              <Col md={3}>{taskObj.originator.full_name}</Col>
              <Col md={3}>{taskObj.engineer_full_name}</Col>
              <Col md={1}>
                { taskObj.report_id
                  ? <Link 
                      to={'/report/' + taskObj.report_id + '/'}
                      target='_blank'
                    >
                      Читать
                    </Link>
                  : <span>Не найден</span>
                }
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={1}><b>Состав работ:</b></Col>
              <Col md={5} style={{whiteSpace: "pre-wrap"}}>{taskObj.description}</Col>
              <Col md={2}><b>Комментарии:</b></Col>
              <Col md={4} style={{whiteSpace: "pre-wrap"}}>{taskObj.comment}</Col>
            </Row> 
            <hr />
          </div>
        : <div className='alert-danger'>Задача не найдена.</div>
      }
    </div>
  );
}

export default TaskDetails;
