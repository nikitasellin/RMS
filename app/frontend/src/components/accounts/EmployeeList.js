import { 
  useState,
  useEffect,
} from 'react';
import { Table } from 'react-bootstrap';

import { EmployeeService } from '../../services/employee.service';



const AccountService = new EmployeeService();

const EmployeeList = () => {
  const [employeeList, setEmployeeList] = useState([]);


  const retrieveEmployeeList = () => {
    AccountService.getAll()
      .then((response) => {
        setEmployeeList(response.data);
      })
      .catch((error) => {
        console.error();
      })
  }


  useEffect(() => {
      retrieveEmployeeList();
    }, []
  )

  return(
    <>
      { employeeList.length > 0 &&
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Отчество</th>
              <th>e-mail</th>
              <th>Телефон</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            { employeeList.map((employee) => {
              return(
                <tr>
                  <td>{employee.last_name}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.middle_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone_number}</td>
                  <td>{employee.role}</td>
                </tr>
              );}
            )}
          </tbody>
        </Table>
      }
    </>
  );
}

export default EmployeeList;