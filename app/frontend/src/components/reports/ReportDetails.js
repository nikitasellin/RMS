import { 
  useState,
  useEffect,
} from 'react';
import { 
  Col, 
  Row,
} from 'react-bootstrap';

import ReportsService from '../../services/reports.service';
import { SrvNumber } from '../tasks/TaskHelpers';


const ReportService = new ReportsService();

const ReportDetails = (props) => {
  document.title = 'Просмотр отчёта';
  
  const reportId = props.match.params.id;
  const [reportObj, setReportObj] = useState()

  const retrieveReport = (id) => {
    console.log('Retrieve report!');
    ReportService.getReport(id)
      .then((response) => {
        setReportObj(response.data);
      })
      .catch((error) => {
        console.log(error)
      }
    );
  }
  
  useEffect(() => {
    retrieveReport(reportId);
  }, [])


  return(
    <div className='col-md-8 m-auto'>
      { reportObj &&
        <>
          <h2 className='text-center'>{reportObj.title}</h2>
          <hr />
          <Row>
            <Col md={4}><b>Дата выезда/начала работ:</b></Col>
            <Col md={2}>{reportObj.start_date}</Col>
            <Col md={6}></Col>
          </Row>
          <hr />
          <Row>
            <Col md={4}><b>Дата возвращения/завершения работ:</b></Col>
            <Col md={6}>{reportObj.completion_date}</Col>
            <Col md={5}></Col>
          </Row>
          <hr />
          <Row>
            <Col md={2}><b>Описание хода работ:</b></Col>
            <Col md={10} style={{whiteSpace: "pre-wrap"}}>{reportObj.body}</Col>
          </Row>
          <hr />
          <Row>
            <Col md={2}><b>Итоги работ:</b></Col>
            <Col md={10} style={{whiteSpace: "pre-wrap"}}>{reportObj.results}</Col>
          </Row>
          <hr />
          <Row>
            <Col md={2}><b>Ссылки на документацию:</b></Col>
            <Col md={10} style={{whiteSpace: "pre-wrap"}}>{reportObj.files}</Col>
          </Row>
          <hr />
          <Row>
            <Col md={2}><b>Номер запроса</b></Col>
            <Col md={2}><b>Заказчик</b></Col>
            <Col md={2}><b>Город</b></Col>
            <Col md={2}><b>Фактическое время (ч)</b></Col>
            <Col md={4}><b>Комментарии</b></Col>
          </Row>
          <hr />
          { reportObj && reportObj.tasks.map((wt) => {
              return(
                <Row key={wt.srv_number}>
                  <Col md={2}>
                    <SrvNumber idx={wt.id} srvNumber={wt.srv_number} />
                  </Col>
                  <Col md={2}>{wt.customer}</Col>
                  <Col md={2}>{wt.city}</Col>
                  <Col md={2}>{wt.actual_time}</Col>
                  <Col md={4}>{wt.comment}</Col>
                </Row>  
              )}
          )}
          <hr />
        </>
      }
    </div>
  );
}


export default ReportDetails;
