const ErrorMessage = (props) => {
  const error = props.message
  return(
    <>
      {error && 
        <div className='form-group alert-danger'>
          {error.message}
        </div>  
      }
    </>
  );
}


export default ErrorMessage;
