import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Router,
  Switch,
  Route,
} from 'react-router-dom';

import NavBar from './components/NavBar';
import Login from './components/accounts/Login';
import EmployeeCreate from './components/accounts/EmployeeCreate';
import EmployeeList from './components/accounts/EmployeeList';
import HomePage from './components/accounts/HomePage';
import AssignedTasks from './components/accounts/AssignedTasks';
import TaskCreateUpdate from './components/tasks/TaskCreateUpdate';
import TaskList from './components/tasks/TaskList';
import TaskSchedule from './components/tasks/TaskSchedule';
import TaskDetails from './components/tasks/TaskDetails';
import TaskAssignEngineer from './components/tasks/TaskAssignEngineer';
import TaskChangeStatus from './components/tasks/TaskChangeStatus';
import TaskChangeEV from './components/tasks/TaskChangeEV';
import TaskChangeDueDate from './components/tasks/TaskChangeDueDate';
import ReportList from './components/reports/ReportList';
import ReportDetails from './components/reports/ReportDetails';

import { clearMessage } from './actions/messages';
import { 
  loadDirections,
  loadExecutionVariants,
  loadStatuses,
 } from './actions/taskOptions'; 

import { history } from './helpers/history';


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadDirections());
    dispatch(loadExecutionVariants());
    dispatch(loadStatuses());
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  return(
    <Router history={history}>
      <NavBar />
      <div className='container-fluid'>
        <Switch>
          <Route exact path='/login/' component={Login} />
          <Route exact path='/employee/create/' component={EmployeeCreate} />
          <Route exact path='/employee/list/' component={EmployeeList} />
          <Route exact path='/employee/homepage/' component={HomePage} />
          <Route exact path='/employee/assigned-tasks/' component={AssignedTasks} />
          <Route exact path='/report/list/' component={ReportList} />
          <Route exact path='/report/list/page/:number/' component={ReportList} />
          <Route exact path='/report/:id/' component={ReportDetails} />
          <Route exact path='/task/create/' render={(props) => (<TaskCreateUpdate {...props} action={'createTask'} />)} />
          <Route exact path='/' component={TaskList} />
          <Route exact path='/page/:number/' component={TaskList} />
          <Route exact path='/task/schedule/:isoWeek/' component={TaskSchedule} />
          <Route exact path='/task/:id/' component={TaskDetails} />
          <Route exact path='/task/update/:id/' render={(props) => (<TaskCreateUpdate {...props} action={'updateTask'} />)} />
          <Route exact path='/task/assign-engineer/:id/' component={TaskAssignEngineer} />
          <Route exact path='/task/change-status/:id/' component={TaskChangeStatus} />
          <Route exact path='/task/change-execution-variant/:id/' component={TaskChangeEV}/>
          <Route exact path='/task/change-due-date/:id/' component={TaskChangeDueDate} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
