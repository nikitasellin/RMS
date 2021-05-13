import { 
  useEffect,
  useState,
} from 'react';
import { 
  Row,
  Col,
} from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { 
  Controller,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Redirect } from 'react-router';

import ReportsService from '../../services/reports.service';
import ErrorMessage from '../forms/ErrorMessage';
import { SrvNumber } from '../tasks/TaskHelpers';


const REQUIRED = 'Обязательное поле';

const ReportService = new ReportsService();

// Move to helpers?
const formattedDate = (date) => {
  return(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
}


const ReportWrite = ({forReport}) => {
  document.title = 'Создание отчёта';

  const [firstRender, setFirstRender] = useState(true);
  const { control, register, handleSubmit, formState: { errors } } = useForm();
  const { fields, prepend } = useFieldArray({
    control,
    name: 'actual_time',
  });
  const [errorMessage, setErrorMessage] = useState();
  const [created, setCreated] = useState();


  const taskList = forReport;

  const onSubmit = data => {
    data.start_date = formattedDate(data.start_date);
    data.completion_date = formattedDate(data.completion_date);
    data.tasks = [];
    let taskUpdateParams = [];
    taskList.forEach((item) => {
      data.tasks.push(item.id);
      taskUpdateParams.push(
      { 
        task_id: item.id,
        hours: Number(data.actual_time[0][item.id].hours),
        comment: data.comment[0][item.id].text,
      });
    });
    data.taskUpdateParams = taskUpdateParams;
    delete data.actual_time;
    delete data.comment;

    console.log(data);
    
    ReportService.createReport(data)
      .then(response => {
        setErrorMessage('');
        setCreated(`/report/${response.data.id}/`);
      })
      .catch((error) => {
        console.log(error.response);
        setErrorMessage({message: error.response.data});

      }
    );
  }  

  useEffect(() =>
    {
      if (firstRender) {
        prepend();
        setFirstRender(false);
      }
    }, []
  )

  return(
    <>
      { created
        ? <Redirect to={created} />
        :
          <div className='container-fluid'>
            <h2 className='text-center'>Заполните поля</h2>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg={4}><label htmlFor='start_date'><b>Дата выезда/начала работ:</b></label></Col>
                <Col lg={2}>
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => (
                      <ReactDatePicker
                        onChange={onChange}
                        onBlur={onBlur}
                        selected={value}
                        showWeekNumbers
                        dateFormat='yyyy-MM-dd'
                      />)
                    }
                    name='start_date'
                    control={control}
                    rules={
                      { required: {value: true, message: REQUIRED }}
                    }
                  />
                  <ErrorMessage message={errors.start_date} />
                </Col>
                <Col lg={6}></Col>
              </Row>
              <hr />
              <Row>
                <Col lg={4}><label htmlFor='completion_date'><b>Дата возвращения/завершения работ:</b></label></Col>
                <Col lg={6}>
                <Controller
                    render={({ field: { onChange, onBlur, value } }) => (
                      <ReactDatePicker
                        onChange={onChange}
                        onBlur={onBlur}
                        selected={value}
                        showWeekNumbers
                        dateFormat='yyyy-MM-dd'
                      />)
                    }
                    name='completion_date'
                    control={control}
                    rules={
                      { required: {value: true, message: REQUIRED }}
                    }
                  />
                  <ErrorMessage message={errors.completion_date} />
                </Col>
                <Col lg={5}></Col>
              </Row>
              <hr />
              <Row>
                <Col lg={2}><label htmlFor='title'><b>Заголовок:</b></label></Col>
                <Col lg={10}>
                  <input
                    type='text'
                    className='form-control'
                    {...register('title') }
                    placeholder='Заполните поле, или оставьте пустым для автоматической генерации при сохранении'
                  /> 
                </Col>
              </Row>
              <hr />
              <Row>
                <Col lg={2}><label htmlFor='body'><b>Описание хода работ:</b></label></Col>
                <Col lg={10}>
                  <textarea
                    className='form-control'
                    {...register(
                        'body',
                        { required: {value: true, message: REQUIRED }}
                      )
                    }
                  />
                  <ErrorMessage message={errors.body} />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col lg={2}><label htmlFor='results'><b>Итоги работ:</b></label></Col>
                <Col lg={10}>
                  <textarea
                    className='form-control'
                    {...register(
                        'results',
                        { required: {value: true, message: REQUIRED }}
                      )
                    }
                  />
                  <ErrorMessage message={errors.results} />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col lg={2}><label htmlFor='files'><b>Ссылки на документацию:</b></label></Col>
                <Col lg={10}>
                  <textarea
                    className='form-control'
                    {...register('files')}
                  />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col lg={2}><b>Номер запроса</b></Col>
                <Col lg={2}><b>Заказчик</b></Col>
                <Col lg={2}><b>Город</b></Col>
                <Col lg={2}><b>Фактическое время (ч)</b></Col>
                <Col lg={4}><b>Комментарии</b></Col>
              </Row>
              { taskList.map((task) => {
                  return(
                    <Row key={task.id}>
                      <Col lg={2}><SrvNumber idx={task.id} srvNumber={task.srv_number} /></Col>
                      <Col lg={2}>{task.site.customer.official_name}</Col>
                      <Col lg={2}>{task.site.city.alternate_names}</Col>
                      <Col lg={2}>
                        { fields.map((item, index) => (
                            <input
                              key={item.id}
                              className='form-control'
                              type='number'
                              step='0.01'
                              defaultValue={item.hours}
                              {...register(
                                `actual_time.${index}.${task.id}.hours`,
                                { min: 
                                  { value: 0, 
                                    message: 'Значение должно быть >= 0'
                                  }, 
                                max: 
                                  { value: 40, 
                                    message: 'Значение должно быть <= 40'
                                  }
                                },
                                { required: {value: true, message: REQUIRED } }
                              )}
                            />
                          ))
                        }
                      </Col>
                      <Col lg={4}>
                        { fields.map((item, index) => (
                            <textarea
                              key={item.id}
                              className='form-control'
                              type='number'
                              step='0.01'
                              defaultValue={item.hours}
                              {...register(`comment.${index}.${task.id}.text`)}
                            />
                          ))
                        }
                      </Col>

                    </Row>  
                  )}
              )}
              <hr />
              <ErrorMessage message={errorMessage}/>
              <input 
                type='submit'
                value='Сохранить отчёт' 
                className='btn btn-dark btn-block'
              />
            </form>  
          </div>
      }
    </>
  );
}

export default ReportWrite;
