import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export const SrvNumber = ({idx, srvNumber}) => {
  return(
    <>
      <Link to={'/task/' + idx + '/'} target='_blank' key={idx}>{srvNumber}</Link>
    </>
  );
}


export const Directions = ({values}) => {
  return(
    <>
      {values.map((value) => {
        return (
          <Badge pill variant='secondary' key={value.id}> 
            {value.name}
          </Badge>
          );
        })
      }
    </>
  );
}


export const Status = ({idx, statusList}) => {
  const badgeVariant = {
    O: 'danger',
    A: 'warning',
    D: 'success',
    R: 'dark'
  }

  let value = {
    id: idx,
    name: 'Неизвестно'
  }
  statusList.forEach((status) =>
    { 
      if (status.value === idx) {
        value.name = status.label;
      }
    }  
  );

  return(
    <Badge pill variant={badgeVariant[idx]} key={value.id}>
      {value.name}
    </Badge>
  );
}
