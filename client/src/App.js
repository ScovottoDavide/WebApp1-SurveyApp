import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { Redirect, Route, Switch } from 'react-router'
import LoginForm from './LoginForm';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage'
import API from './API'

function App() {
  const [errorMsg, setErrorMsg] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounting, setMounting] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const checkAuth = () => {
      API.getUserInfo().then((user) => {
        setUserInfo({ email: user.username, name: user.name });
        setLoggedIn(true);
        setMounting(false);
      }).catch((err) => {
        setMounting(false);
        console.log(err.error);
      });
    };
    checkAuth();
  }, []);

  const doLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setUserInfo({ email: user.username, name: user.name });
      setLoggedIn(true);
      setErrorMsg({ msg: `Welcome ${user.name} !`, type: 'success' });
    } catch (err) {
      throw err;
    }
  }

  const doLogout = async () => {
    try {
      await API.logout();
      setLoggedIn(false);
      setUserInfo({});
    }
    catch (err) {
      throw err;
    }
  }

  return (
    <Router>
      <Container fluid>
        <Row className="vheight-100">
          <Switch>
            <Route exact path="/login">
              {mounting ? '' : <>{loggedIn ? <Redirect to="/admin" /> : <Row className="login"><LoginForm login={doLogin} /></Row>}</>}
            </ Route>
            <Route exact path="/admin">
              {mounting ? '' : <>{loggedIn ? <AdminPage loggedIn={loggedIn} doLogout={doLogout} userInfo={userInfo} errorMsg={errorMsg} setErrorMsg={setErrorMsg} /> : <Redirect to="/user" />}</>}
            </Route>
            <Route exact path="/user">
              {mounting ? '' : <>{loggedIn ? <Redirect to="/admin" /> : <UserPage loggedIn={loggedIn} doLogout={doLogout} userInfo={userInfo} />}</>}
            </Route>
            <Route path="/">
              {mounting ? '' : <>{loggedIn ? <Redirect to="/admin" /> : <Redirect to="/user" />}</>}
            </Route>
          </Switch>
        </Row>
      </Container>
    </Router>
  )
}

export default App;
