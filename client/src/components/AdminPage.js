import SidebarSurvey from "./Sidebar";
import SurveyNavbar from './Navbar';
import { Container, Alert } from 'react-bootstrap';

function AdminPage(props) {
    return (
        <>
            <SurveyNavbar doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn} />
            <SidebarSurvey loggedIn={props.loggedIn} />
            <Container className="col-sm-8 col-12 below-nav">
                {props.errorMsg.msg && <Alert variant={props.errorMsg.type} onClose={() => props.setErrorMsg('')} dismissible> {props.errorMsg.msg} </Alert>}
            </Container>
        </>
    );
}

export default AdminPage;