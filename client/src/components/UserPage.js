import SidebarSurvey from "./Sidebar";
import SurveyNavbar from './Navbar';
import { Table, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { CardChecklist } from 'react-bootstrap-icons'
import { Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'

function UserPage(props) {
    return (
        <>
            <SurveyNavbar doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn} />
            <SidebarSurvey loggedIn={props.loggedIn} />
            <Container className="col-sm-8 col-12 below-nav">
                {
                    props.errorMsg.msg ?
                        <Alert variant={props.errorMsg.type} onClose={() => props.setErrorMsg('')} dismissible> {props.errorMsg.msg} </Alert>
                        :
                        <>{
                            props.loadingU ? <span className="col-sm-8 col-12 below-nav spinner"><Spinner animation="border" /></span>
                                :
                                <UserPageContent allSurveys={props.allSurveys} userInfo={props.userInfo} setToAnswer={props.setToAnswer} />
                        }</>
                }
            </Container>

        </>
    );
}

function UserPageContent(props) {
    return (
        <>
            <Form.Text className="mb-4 mt-3" as="h3"><i>All published surveys </i></Form.Text>
            <Table striped bordered >
                <thead>
                    <tr>
                        <th>N°</th>
                        <th className="col col-4">Title</th>
                        <th className="col col-3">Author</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.allSurveys.map((s) => <SurveyRow key={s.id} survey={s} surveys={props.allSurveys} setToAnswer={props.setToAnswer} />)
                    }
                </tbody>
            </Table>
        </>
    )
}

function SurveyRow(props) {
    return <tr><SurveyRowData survey={props.survey} surveys={props.surveys} /><SurveyRowControl survey={props.survey} setToAnswer={props.setToAnswer} /></tr>
}

function SurveyRowData(props) {
    return (
        <>
            <td>{props.surveys.indexOf(props.survey) + 1}</td>
            <td>{props.survey.title}</td>
            <td>{props.survey.author}</td>
        </>
    )
}

function SurveyRowControl(props) {

    return (
        <td>
            <NavLink to={{
                pathname: "/user/answer",
                state: { survey: props.survey }
            }}><Button type="submit" size="sm" variant="outline-success" ><CardChecklist size={20} /></Button></NavLink>
        </td>
    )
}

export default UserPage;