import { useState } from 'react';
import { Navbar, Form, FormControl, Button, Dropdown } from 'react-bootstrap'
import { PersonCircle, CardList } from 'react-bootstrap-icons'
import { Redirect } from 'react-router'

function SurveyNavbar(props) {
    return (
        <Navbar expand="sm" variant="dark" fixed="top" bg="dark">
            <Navbar.Toggle aria-controls="#navCollapse" />
            <NavbarLogo />
            <NavbarSearch />
            <NavbarUserLog  doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn}/>
        </Navbar>
    );
}

function NavbarLogo() {
    return (
        <Navbar.Brand href="/">
            <CardList size={30} /><i> Questionary</i>
        </Navbar.Brand>
    );
}

function NavbarSearch() {
    return (
        <Form inline className="mx-auto d-none d-md-block">
            <FormControl type="text" placeholder="Search" />
            <Button variant="outline-success" className="mx-auto"> Search</Button>
        </Form>
    );
}

function NavbarUserLog(props) {
    const [log, setLog] = useState(false);
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
                    <PersonCircle color="green" size={30} />
                </Dropdown.Toggle>

                <Dropdown.Menu alignRight>
                    <Dropdown.Header><i>Signed in as: </i><strong>{props.loggedIn ? props.userInfo.name : ''}</strong></Dropdown.Header>
                    <Dropdown.Header><i>Email: </i><strong>{props.loggedIn ? props.userInfo.email : ''}</strong></Dropdown.Header>
                    <Dropdown.Header></Dropdown.Header>
                    {props.loggedIn ? <Dropdown.Item className="text-center" onClick={()=> props.doLogout()}> Logout </Dropdown.Item> : <Dropdown.Item className="text-center" onClick={()=>setLog(true)}> Login </Dropdown.Item>}
                    {log && <Redirect to="/login" />}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

export default SurveyNavbar