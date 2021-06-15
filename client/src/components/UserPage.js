import SidebarSurvey from "./Sidebar";
import SurveyNavbar from './Navbar';
import UserPageContent from "./UserPageContent";
import {Container} from 'react-bootstrap';

function UserPage(props) {
    console.log(props.allSurveys);
    return (
        <>
            <SurveyNavbar doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn} />
            <SidebarSurvey loggedIn={props.loggedIn} />
            <Container className="col-sm-8 col-12 below-nav">
                <UserPageContent allSurveys={props.allSurveys} userInfo={props.userInfo} />
            </Container>

        </>
    );
}

export default UserPage;