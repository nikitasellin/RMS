import { 
  useState,
  useEffect,
} from 'react';
import { 
  Pagination,
  Table,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import ReportsService from '../../services/reports.service';
import { SrvNumber } from '../tasks/TaskHelpers';


const ReportService = new ReportsService();

const ReportList = (props) => {
  document.title = 'Список отчётов';

  const [reports, setReports] = useState([]);
  const [pagesCount, setPagesCount] = useState(1);
  const [activePage, setActivePage] = useState(null);
  const [paginatorItems, setPaginatorItems] = useState([]);

  const retrieveReports = () => {
    console.log('Retrieve reports.');
    if (activePage) {
      ReportService.getReportsByPageNumber(activePage)
      .then((response) => {
        setReports(response.data.results);
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
            to={'/reports/list/page/' + number + '/'}
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
    retrieveReports();
    }, [activePage]
  )

  useEffect(() => {
      createPaginatorItems();
    }, [activePage, pagesCount]
  )


  return(
    <>
      { reports.length > 0 &&
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Тема</th>
              <th>Автор</th>
              <th>Дата выезда/ начала работ</th>
              <th>Дата возвращения/ окончания работ</th>
              <th>Связанные запросы</th>
            </tr>
          </thead>
          <tbody>
            { reports.map((report) => {
                return(
                <tr key={report.id}>
                  <td>
                    <Link to={'/report/' + report.id + '/'}>{report.title}</Link>
                  </td>
                  <td>{report.author.full_name}</td>
                  <td>{report.start_date}</td>
                  <td>{report.completion_date}</td>
                  <td>
                    { report.tasks.map((wt) => {
                        return(
                          <span key={wt.srv_number} className='badge badge-pill badge-light'>
                            <SrvNumber idx={wt.id} srvNumber={wt.srv_number} />
                          </span>
                        );
                      })                    
                    }
                  </td>
                </tr>
                );
              })
            }  
          </tbody>
        </Table>  
      }
      <Pagination>
        {paginatorItems}
      </Pagination>
    </>
  );
}

export default ReportList;
