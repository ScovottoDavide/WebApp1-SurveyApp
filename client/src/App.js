import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { Redirect, Route, Switch } from 'react-router'
import LoginForm from './LoginForm';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage'
import AddSurvey from './components/AddSurvey';
import SurveyNavbar from './components/Navbar';
import UserAnswer from './components/UserAnswer';
import API from './API';

function App() {
  const [errorMsg, setErrorMsg] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounting, setMounting] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [allSurveys, setAllSurveys] = useState([]);
  const [inFormQuestions, setInFormQuestions] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loadingA, setLoadingA] = useState(true);
  const [loadingU, setLoadingU] = useState(true);
  const [dirty, setDirty] = useState(true);

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

  useEffect(() => {
    const getAllSurveys = async () => {
      const list = await API.RetrieveAllSurveys();
      setAllSurveys(list);
    }
    if (!loggedIn && dirty) {
      getAllSurveys().then(() => {
        setLoadingU(false);
        setDirty(false);
      }).catch(err => {
        console.error(err);
      });;
    }
  }, [allSurveys.length, dirty, loggedIn]);

  useEffect(() => {
    const getSurveys = async () => {
      if (loggedIn) {
        const list = await API.RetrieveSurveyList();
        setSurveys(list);
      }
    }

    if (loggedIn && dirty) {
      getSurveys().then(() => {
        setLoadingA(false);
        setDirty(false);
      }).catch(err => {
        console.error(err);
      });;
    }
  }, [surveys.length, loggedIn, dirty]);

  useEffect(() => {
    const getQuestions = async () => {
      if (loggedIn) {
        const list = await API.RetrieveQuestionsList();
        setInFormQuestions(list);
      }
    }

    if (loggedIn && dirty) {
      getQuestions().then(() => {
        setDirty(false);
      }).catch(err => {
        console.error(err);
      });;
    }
  }, [surveys.length, inFormQuestions.length, loggedIn, dirty]);

  const doLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setUserInfo({ email: user.username, name: user.name });
      setLoggedIn(true);
      setDirty(true);
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

  /* DB saving survey */
  const surveyAdder = (survey) => {
    survey.status = 'added';
    setSurveys(ss => [...ss, survey]);

    API.AddSurveyDB(survey)
      .then(()=>setDirty(true)).catch(err => console.log(err));
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
              {mounting ? ''
                :
                <>
                  {loggedIn ?
                    <AdminPage loggedIn={loggedIn} doLogout={doLogout} userInfo={userInfo} errorMsg={errorMsg} setErrorMsg={setErrorMsg}
                      inFormQuestions={inFormQuestions} setInFormQuestions={setInFormQuestions} surveys={surveys} loadingA={loadingA} />
                    :
                    <Redirect to="/user" />}
                </>}
            </Route>
            <Route exact path="/admin/addSurvey">
              {mounting ? '' : <>{loggedIn ?
                <>
                  <SurveyNavbar doLogout={doLogout} userInfo={userInfo} loggedIn={loggedIn} />
                  <AddSurvey surveyAdder={surveyAdder} surveys={surveys} inFormQuestions={inFormQuestions} setInFormQuestions={setInFormQuestions} loggedIn={loggedIn} />
                </>
                :
                <Redirect to="/user" />}</>}
            </Route>
            <Route exact path="/user">
              {mounting ? '' : <>{loggedIn ? <Redirect to="/admin" /> : <UserPage loggedIn={loggedIn} doLogout={doLogout} userInfo={userInfo} allSurveys={allSurveys} loadingU={loadingU}/>}</>}
            </Route>
            <Route exact path="/user/answer">
              <SurveyNavbar doLogout={doLogout} userInfo={userInfo} loggedIn={loggedIn} />
              <UserAnswer />
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
