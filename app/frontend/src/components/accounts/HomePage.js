import { 
  useEffect,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const EngineerBlock = () => {
  return(
    <>
      <li>
        <Link to='/employee/assigned-tasks/'>Назначенные запросы</Link>
      </li>
      <li>
        <Link>Мои отчёты</Link>
      </li>
    </>
  );
}

const ManagerBlock = () => {
  return(
    <>
      <li>
        <Link to='/employee/created-tasks/'>Созданные запросы</Link>
      </li>
    </>
  );
}

const TeamLeadBlock = () => {
  return(
    <>
      <li>
        <Link to='/employee/all-tasks/'>Все запросы</Link>
      </li>
      <li>
        <Link>Все отчёты</Link>
      </li>
    </>
  );
}

const HomePage = (props) => {
  document.title = 'Личный кабинет';

  const currentUser = useSelector(state => state.auth.user);
  const [userBlock, setUserBlock] = useState(undefined);

  useEffect(() => {
      switch(currentUser.role) {
        case 'engineer':
          setUserBlock(EngineerBlock);
          break;
        case 'manager':
          setUserBlock(ManagerBlock);
          break;
        case 'teamlead':
          setUserBlock(TeamLeadBlock);
          break;  
        case 'admin':
          setUserBlock(TeamLeadBlock);
          break;
      }
    }, []
  ) 

  return (
    <div className='col-md-4 m-auto'>
      <h1>Личный кабинет</h1>
      <ul>
        { userBlock &&
            userBlock
        }
        <li>
          <Link>Профиль</Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
