import SidebarSurvey from "./Sidebar";
import SurveyNavbar from './Navbar';
import AddSurvey from './AddSurvey'
import AdminPageContent from "./AdminPageContent";
import API from '../API'
import { Container, Alert, Button } from 'react-bootstrap';
import { Route, Switch } from 'react-router'
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { useState, useEffect } from "react";



function AdminPage(props) {
    const [surveys, setSurveys] = useState([]);
    const [inFormQuestions, setInFormQuestions] = useState([]);
    const [compiling, setCompiling] = useState(false);

    
    useEffect(() => {
        const getSurveys = async () => {
            if (props.loggedIn) {
                const list = await API.RetrieveSurveyList();
                setSurveys(list);
            }
        }

        if (props.loggedIn) {
            getSurveys().then(() => {
            }).catch(err => {
                console.error(err);
            });;
        }
    }, [surveys.length, props.loggedIn]);

    useEffect(() => {
        const getQuestions = async () => {
            if (props.loggedIn) {
                const list = await API.RetrieveQuestionsList();
                setInFormQuestions(list);
            }
        }

        if (props.loggedIn) {
            getQuestions().then(() => {
            }).catch(err => {
                console.error(err);
            });;
        }
    }, [surveys.length, inFormQuestions.length, props.loggedIn]);

    /* DB saving survey */
    const surveyAdder = (survey) => {
        setSurveys(ss => [...ss, survey]);

        API.AddSurveyDB(survey)
            .then().catch(err => console.log(err));
    }
    return (
        <>
            <Router>
                <SurveyNavbar doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn} />
                <Switch>
                    <Route exact path="/admin">
                        {!compiling &&
                            <>
                                <SidebarSurvey loggedIn={props.loggedIn} />
                                <Container className="col-sm-8 col-12 below-nav">
                                    {props.errorMsg.msg && <Alert variant={props.errorMsg.type} onClose={() => props.setErrorMsg('')} dismissible> {props.errorMsg.msg} </Alert>}
                                    <NavLink to="/admin/addSurvey"><Button type="submit" size="lg" variant="success" className="fixed-right-bottom" onClick={() => setCompiling(true)}>&#43;</Button></NavLink>
                                    <AdminPageContent surveys={surveys} userInfo={props.userInfo}/>
                                </Container>
                            </>}
                    </Route>

                    <Route exact path="/admin/addSurvey">
                        <AddSurvey surveyAdder={surveyAdder} surveys={surveys} inFormQuestions={inFormQuestions} loggedIn={props.loggedIn} compiling={compiling} setCompiling={setCompiling}/>
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default AdminPage;