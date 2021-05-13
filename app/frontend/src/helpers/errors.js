const handleError = props => {
  let data = null;

  if (props) {
    data = Object.values(props.data);
  }
  console.log(data);
  return(
    <>
      {data &&
        data.map(item => (
          <p key={item}>Ошибка: {item}</p>
        ))      
      }
    </>
  );  
}


export default handleError;
