import {
    Navbar,
    Nav,
    NavDropdown,
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  useSelector,
  useDispatch,
 } from 'react-redux';

import { 
  logout,
} from '../actions/auth';


const NavBar = () => {
  const currentUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Navbar variant='dark' bg='dark' expand='lg'>
      <Navbar.Brand
        as={NavLink}
        to='/'
      >
        RMS
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='m-auto'>
          <NavDropdown title='Рабочие задачи' id='tasks-nav-dropdown'>
            <NavDropdown.Item 
              as={NavLink} 
              to='/task/create/' 
              activeClassName='active'
            >
              Добавить
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link
            as={NavLink} 
            to='/report/list/' 
            activeClassName='active'
          >
            Отчёты
          </Nav.Link>
          <Nav.Link href=''>
            Статистика
          </Nav.Link>
          <NavDropdown title='Сотрудники' id='accounts-nav-dropdown'>
            <NavDropdown.Item 
              as={NavLink} 
              to='/employee/list/' 
              activeClassName='active'
            >
              Список
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item 
              as={NavLink} 
              to='/employee/create/' 
              activeClassName='active'
            >
              Добавить
            </NavDropdown.Item>
          </NavDropdown>

        </Nav>
        <Nav className="justify-content-right">
          {currentUser
            ?
            <NavDropdown title={currentUser.full_name} id="user-nav-dropdown" className='btn btn-outline-secondary'>
              <NavDropdown.Item 
                as={NavLink}
                to='/employee/homepage/'
                activeClassName='active'
              >
                Моя страница
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item 
                href='/login/'
                onClick={logOut}
              >
                Выход
              </NavDropdown.Item>
            </NavDropdown>
            : <NavLink to='/login/' className='btn btn-light'>Вход</NavLink>
          } 
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
