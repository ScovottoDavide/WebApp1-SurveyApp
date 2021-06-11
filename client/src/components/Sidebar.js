import { Nav, ListGroup } from 'react-bootstrap'

function SidebarSurvey(props) {

    return (
        <Nav hidden="md" className="d-md-block col-sm-4 col-12 bg-light below-nav" >
            <ListGroup variant="flush">
                <ListGroup.Item active className="ml-2"> Surveys </ListGroup.Item>
                {props.loggedIn ? '' : <><h className="ml-5 mt-3"><i>In this page you can answer to all admin surveys</i></h> 
                                         <h className="ml-3 mt-3">Don't forget to press "Submit" after you complied the survey; <strong className="ml-5">otherwise all your answers will be lost!</strong></h></>}
            </ListGroup>
        </Nav>
    );
}

export default SidebarSurvey;