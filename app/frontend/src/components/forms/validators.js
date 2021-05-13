const requiredField = (value) => {
  if (!value) {
    return (
      <div className='alert alert-danger' role='alert'>
        Обязательное поле!
      </div>
    );
  }
};

export default requiredField;
