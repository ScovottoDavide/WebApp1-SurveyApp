import { useState } from "react";
import { Form, Button, Alert, ButtonGroup } from 'react-bootstrap';
import { Redirect } from "react-router";

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cancel, setCancel] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    let valid = true;
    if (username === '' || password === '' || password.length < 6)
      valid = false;

    if (valid) {
      try {
        await props.login(credentials);
      } catch (err) {
        setErrorMessage(err);
      }

    }
    else
      setErrorMessage('Username cannot be blank and/or password must be at least 6 characters.')
  };

  const handleCancel = () => {
    setCancel(true);
  }

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
      <ButtonGroup className="buttons">
        <Button className="mr-3" variant="danger" onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Login</Button>
      </ButtonGroup>
      {cancel ? <Redirect to="/user" /> : ''}
      {errorMessage ? <Alert className="mt-3" variant='danger'>{errorMessage}</Alert> : ''}
    </Form>
  )
}

export default LoginForm;