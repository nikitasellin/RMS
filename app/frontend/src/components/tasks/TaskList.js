import { 
  useEffect, 
  useState,
} from 'react';
import { 
  Pagination,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap'
import TasksService from '../../services/tasks.service';
import TaskListForAdmin from './TaskListForAdmin';
import TaskListForAll from './TaskListForAll';


const TaskService = new TasksService();

const TaskList = (props) => {
  document.title = 'Список рабочих задач';

  const currentUser = useSelector(state => state.auth.user);

  const [workTasks, setWorkTasks] = useState([]);
  const [pagesCount, setPagesCount] = useState(1);
  const [activePage, setActivePage] = useState(null);
  const [paginatorItems, setPaginatorItems] = useState([]);


  const retrieveWorkTasks = () => {
    console.log('Retrieve tasks.');
    if (activePage) {
      TaskService.getTasksByPageNumber(activePage)
      .then((response) => {
        setWorkTasks(response.data.results);
        let num_pages = response.data.num_pages;
        if (num_pages !== pagesCount) {
          setPagesCount(num_pages);
          }})
      .catch((error) => console.log(error));
    }
  }
  
  const createPaginatorItems = () => {
    console.log('Create pagination.');
    if (pagesCount > 1) {
      let items = [];
      for (let number = 1; number <= pagesCount; number++) {
        items.push(
          <LinkContainer 
            to={'/page/' + number + '/'}
            key={number}
          >
            <Pagination.Item
              key={number}
              active={number === activePage}
            >
              {number}
            </Pagination.Item>
          </LinkContainer>
        );
      }
      setPaginatorItems(items);
    }
  }

  useEffect(() => {
      if (props && props.match.params.number) {
        setActivePage(props.match.params.number);
      } else {
        setActivePage(1);
      }
    }, [props]
  );

  useEffect(() => {
    retrieveWorkTasks();
    }, [activePage]
  )

  useEffect(() => {
      createPaginatorItems();
    }, [activePage, pagesCount]
  )
  
  return(
    <>
      { workTasks.length > 0 && 
        <>
          { currentUser.role === 'teamlead'
            ? <TaskListForAdmin taskList={workTasks} />
            : <TaskListForAll taskList={workTasks} />
          }
        </>
      }
      <Pagination>
        {paginatorItems}
      </Pagination>
    </>
  );
}

export default TaskList;