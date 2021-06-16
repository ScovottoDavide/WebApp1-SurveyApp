import SidebarSurvey from "./Sidebar";
import SurveyNavbar from './Navbar';
import { useState } from 'react';
import { EyeFill } from 'react-bootstrap-icons'
import { Container, Alert, Button, Table, Spinner } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function AdminPage(props) {

    return (
        <>
            <SurveyNavbar doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn} />
            <SidebarSurvey loggedIn={props.loggedIn} />
            <Container className="col-sm-8 col-12 below-nav">
                {props.errorMsg.msg && <Alert variant={props.errorMsg.type} onClose={() => props.setErrorMsg('')} dismissible> {props.errorMsg.msg} </Alert>}
                <NavLink to="/admin/addSurvey"><Button type="submit" size="lg" variant="success" className="fixed-right-bottom">&#43;</Button></NavLink>
                {
                    props.loadingA ? <span className="col-sm-8 col-12 below-nav spinner"><Spinner animation="border" /></span>
                    :
                    <AdminPageContent surveys={props.surveys} userInfo={props.userInfo} />
                }
                
            </Container>
        </>
    );
}

function AdminPageContent(props) {
    return (
        <>
            <h3 className="mb-4 mt-3"><i>{props.userInfo.name}'s published surveys </i></h3>
            <Table striped bordered >
                <thead>
                    <tr>
                        <th>N°</th>
                        <th className="col col-5">Title</th>
                        <th className="col col-2">Number of answers</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.surveys.map((s) => <SurveyRow key={s.id} survey={s} surveys={props.surveys} />)
                    }
                </tbody>
            </Table>
        </>
    )
}

function SurveyRow(props) {
    return <tr><SurveyRowData survey={props.survey} surveys={props.surveys} /><SurveyRowControl survey={props.survey} /></tr>
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
    const [errorMsg, setErrorMsg] = useState('');

    const handleClick = () => {
        if (!props.survey.answers)
            setErrorMsg("No answers yet received");
    }
    return (
        <td>
            <Button type="submit" size="sm" variant="outline-success" onClick={handleClick}><EyeFill size={20} /></Button>
            {errorMsg && <Alert className="alert small" variant="warning" size="sm" onClick={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
        </td>


    )
}

export default AdminPage;