import SidebarSurvey from "./Sidebar";
import SurveyNavbar from './Navbar';
import { Table, Button } from 'react-bootstrap';
import { CardChecklist } from 'react-bootstrap-icons'
import {Container} from 'react-bootstrap';
import {NavLink} from 'react-router-dom'

function UserPage(props) {
    return (
        <>
            <SurveyNavbar doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn} />
            <SidebarSurvey loggedIn={props.loggedIn} />
            <Container className="col-sm-8 col-12 below-nav">
                <UserPageContent allSurveys={props.allSurveys} userInfo={props.userInfo} setToAnswer={props.setToAnswer}/>
            </Container>

        </>
    );
}

function UserPageContent(props) {
    return (
        <>
            <h3 className="mb-4 mt-3"><i>All published surveys </i></h3>
            <Table striped bordered >
                <thead>
                    <tr>
                        <th>N°</th>
                        <th className="col col-4">Title</th>
                        <th className="col col-3">Number of answers</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.allSurveys.map((s) => <SurveyRow key={s.id} survey={s} surveys={props.allSurveys} setToAnswer={props.setToAnswer}/>)
                    }
                </tbody>
            </Table>
        </>
    )
}

function SurveyRow(props) {
    return <tr><SurveyRowData survey={props.survey} surveys={props.surveys} /><SurveyRowControl survey={props.survey} setToAnswer={props.setToAnswer}/></tr>
}

function SurveyRowData(props) {
    return (
        <>
            <td>{props.surveys.indexOf(props.survey) + 1}</td>
            <td>{props.survey.title}</td>
            <td>{props.survey.answers}</td>
        </>
    )
}

function SurveyRowControl(props) {

    return (
        <td>
            <NavLink to={{
                pathname: "/user/answer",
                state: {survey: props.survey}
                }}><Button type="submit" size="sm" variant="outline-success" onClick={() => props.setToAnswer(props.survey)}><CardChecklist size={20} /></Button></NavLink>
        </td>
    )
}

export default UserPage;