import SidebarSurvey from "./Sidebar";
import SurveyNavbar from './Navbar';

function UserPage(props) {
    return (
        <>
            <SurveyNavbar doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn} />
            <SidebarSurvey loggedIn={props.loggedIn} />
        </>
    );
}

export default UserPage;