import { useState } from "react";
import {Form, Button, Alert} from 'react-bootstrap';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('') ;
  
  const handleSubmit = async (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };
      
      let valid = true;
      if(username === '' || password === '' || password.length < 6)
          valid = false;
      
      if(valid){
        try{
          await props.login(credentials);
        }catch(err){
          setErrorMessage(err);
        }
          
      }
      else 
        setErrorMessage('Username cannot be blank and/or password must be at least 6 characters.')
  };

  return (
    <Form className="col-sm-4 col-12 below-nav">
      <h1 className="text-center">Login</h1>
      <Form.Group controlId='username'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
      </Form.Group>
      <Button onClick={handleSubmit}>Login</Button>
      {errorMessage ? <Alert className="mt-3" variant='danger'>{errorMessage}</Alert> : ''}
  </Form>
  )
}

export default LoginForm;