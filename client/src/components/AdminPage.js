import SidebarSurvey from "./Sidebar";
import SurveyNavbar from './Navbar';
import { Container, Alert, Button } from 'react-bootstrap';
import { Route, Switch } from 'react-router'
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import AddSurvey from './AddSurvey'

function AdminPage(props) {
    
    return (
        <>
            <Router>
                <SurveyNavbar doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn} />
                <Switch>
                    <Route exact path="/admin">
                        <SidebarSurvey loggedIn={props.loggedIn} />
                        <Container className="col-sm-8 col-12 below-nav">
                            {props.errorMsg.msg && <Alert variant={props.errorMsg.type} onClose={() => props.setErrorMsg('')} dismissible> {props.errorMsg.msg} </Alert>}
                            <NavLink to="/admin/addSurvey"><Button type="submit" size="lg" variant="success" className="fixed-right-bottom" >&#43;</Button></NavLink>

                        </Container>
                    </Route>

                    <Route exact path="/admin/addSurvey">
                       <AddSurvey />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default AdminPage;