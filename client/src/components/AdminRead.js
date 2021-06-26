import SurveyNavbar from './Navbar';
import { Container, Nav, Col, Button, Row, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useLocation, Redirect } from 'react-router'
import { ArrowReturnLeft, ArrowReturnRight, ArrowLeft } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom'

function AdminRead(props) {
    const location = useLocation();
    const answers = location.state ? location.state.answers : [];
    const survey = location.state ? location.state.survey : {}
    const [readingA, setReadingA] = useState(true);
    const [index, setIndex] = useState(0);

    const handleLeft = () => {
        if (index - 1 >= 0)
            setIndex(index - 1);
    }

    const handleRigth = () => {
        if (index + 1 < answers.length)
            setIndex(index + 1);
    }

    return (
        <>
            <SurveyNavbar doLogout={props.doLogout} userInfo={props.userInfo} loggedIn={props.loggedIn} />
            <Container className="below-nav sfondo" fluid>
                <Nav variant="tabs" className="navbar navbar-ligth backNav">
                    <Col>
                        <Nav.Item>
                            <Nav.Link className="text-right" active={!readingA} onClick={() => setReadingA(false)}>Survey</Nav.Link>
                        </Nav.Item>
                    </Col>
                    <Col>
                        <Nav.Item>
                            <Nav.Link active={readingA} onClick={() => setReadingA(true)}>Answers</Nav.Link>
                        </Nav.Item>
                    </Col>
                </Nav>
                {readingA ?
                    <ReadContent answer={answers[index]} survey={survey} index={index} answers={answers}
                        handleLeft={handleLeft} handleRigth={handleRigth} setDirty={props.setDirty} setLoadingA={props.setLoadingA} />
                    : <ReadSurvey survey={survey} setDirty={props.setDirty} setLoadingA={props.setLoadingA} />}
            </Container>
        </>
    )
}

function ReadContent(props) {
    return (
        <Container className="below-nav" fluid>
            <Row className="vheight-100 justify-content-center">
                <Col></Col>
                <Col lg={7} className="text-center">
                    <Form>
                        <Col lg={12} className="title-border">
                            <Form.Group>
                                <Form.Text as="h3" className="text-center mb-3">{props.survey.title}</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col sm={8}>
                            <Form.Text as="h3" className="text-left mb-3 mt-3">Compiled by: <i>{props.answer.name}</i></Form.Text>
                        </Col>
                        <Form.Row className="d-flex justify-content-center">
                            <Button className="ml-3 mb-1 bianco" variant="outline-success" size="sm" onClick={props.handleLeft}><ArrowReturnLeft /></Button>
                            <Form.Text as="i" className="ml-3">{props.index + 1}/{props.answers.length}</Form.Text>
                            <Button className="ml-3 mb-1 bianco" variant="outline-success" size="sm" onClick={props.handleRigth} ><ArrowReturnRight /></Button>
                        </Form.Row>
                        <Form.Group className="mb-3 mt-4" controlId="formQuestion">
                            {props.survey.questions ?
                                props.survey.questions.map((q) => <UserAnswerRow key={q.id} question={q} questions={props.survey.questions} answer={props.answer} />)
                                :
                                <Redirect to="/user" />
                            }
                        </Form.Group>
                        <Form.Row className="mb-4 d-flex justify-content-center">
                            <Button className="ml-3 mb-1 bianco" variant="outline-success" size="sm" onClick={props.handleLeft}><ArrowReturnLeft /></Button>
                            <Form.Text as="i" className="ml-3">{props.index + 1}/{props.answers.length}</Form.Text>
                            <Button className="ml-3 mb-1 bianco" variant="outline-success" size="sm" onClick={props.handleRigth}><ArrowReturnRight /></Button>
                        </Form.Row>
                        <NavLink to="/admin">
                            <Button className="fixed-left-bottom bianco" variant="outline-dark" onClick={() => { props.setDirty(true); props.setLoadingA(true) }}>
                                <ArrowLeft /> Return
                            </Button>
                        </NavLink>
                    </Form>
                </Col>
                <Col> </Col>
            </Row>
        </Container>
    )
}

function UserAnswerRow(props) {
    return (
        <>
            <Container className="question-border mb-5">
                <div className="mt-4">
                    <i><strong>{props.question.min ? '* ' : ''}Question # {props.questions.indexOf(props.question) + 1}</strong></i>
                </div>
                <Form.Row className="mt-3">
                    <Col>
                        <Form.Text as="mark" className="text-left mb-3">
                            {props.question.titleQ + " :"}
                        </Form.Text>
                        <Form.Text as="h6" className="text-left mb-3">
                            {props.question.type ? `( You can ansewer a maximum of ${props.question.max} options )` : ''}
                        </Form.Text>
                    </Col>
                </Form.Row>
                {props.question.type ? props.question.options.map((o) =>
                    <UserMultipleChoiceRow key={o.id} option={o} questions={props.questions} question={props.question} answer={props.answer} />)
                    :
                    <UserOpenChoiceRow key={props.question.id} question={props.question} answer={props.answer} />
                }
            </Container>
        </>

    );
}

function UserMultipleChoiceRow(props) {
    return (
        <Form.Row className="mt-2 mb-4 ml-3">
            {props.answer.data.length === 0 ? <Form.Check readOnly label={props.option.titleO} checked={false} /> :
                props.answer.data.map(d => ({ idQ: d.idQ, data: d.data.split(",") })).filter(a => a.idQ === props.question.id)
                    .map(d => ({ id: props.option.id, title: props.option.titleO, data: d.data.includes(props.option.id.toString()) }))
                    .map((o) => <Form.Check key={o.id} readOnly label={o.title} checked={o.data} />)
            }
        </Form.Row>
    );
}

function UserOpenChoiceRow(props) {
    return (
        <Form.Row className="mt-3 mb-4">
            <Form.Control as="textarea" style={{ height: '150px' }} value={props.answer.data.map(d => ({ idQ: d.idQ, data: d.data })).filter(a => a.idQ === props.question.id).map(d => d.data)} readOnly />
        </Form.Row>
    );
}

function ReadSurvey(props) {
    return (
        <Container className="below-nav" fluid>
            <Row className="vheight-100 justify-content-center">
                <Col></Col>
                <Col lg={7} className="text-center">
                    <h3>Original survey you published...</h3>
                    <Form>
                        <Col lg={12} className="mt-4 title-border">
                            <Form.Group>
                                <Form.Text as="h3" className="text-center mb-3">{props.survey.title}</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col sm={8}>

                        </Col>
                        <Form.Group className="mb-3 mt-5" controlId="formQuestion">
                            {props.survey.questions ?
                                props.survey.questions.map((q) => <SurveyRow key={q.id} question={q} questions={props.survey.questions} />)
                                :
                                <Redirect to="/user" />
                            }
                        </Form.Group>
                        <NavLink to="/admin">
                            <Button className="fixed-left-bottom" variant="outline-dark" onClick={() => { props.setDirty(true); props.setLoadingA(true) }}>
                                <ArrowLeft /> Return
                            </Button>
                        </NavLink>
                    </Form>
                </Col>
                <Col> </Col>
            </Row>
        </Container>
    )
}

function SurveyRow(props) {
    return (
        <>
            <Container className="question-border mb-5">
                <div className="mt-4">
                    <i><strong>{props.question.min ? '* ' : ''}Question # {props.questions.indexOf(props.question) + 1}</strong></i>
                </div>
                <Form.Row className="mt-3">
                    <Col>
                        <Form.Text as="mark" className="text-left mb-3">
                            {props.question.titleQ + " :"}
                        </Form.Text>
                        <Form.Text as="h6" className="text-left mb-3">
                            {props.question.type ? `( You can ansewer a maximum of ${props.question.max} options )` : ''}
                        </Form.Text>
                    </Col>
                </Form.Row>
                {props.question.type ? props.question.options.map((o) =>
                    <SurveyChoiceRow key={o.id} option={o} questions={props.questions} question={props.question} />)
                    :
                    <SurveyOpenChoiceRow key={props.question.id} question={props.question} />
                }
            </Container>
        </>

    );
}

function SurveyChoiceRow(props) {
    return (
        <Form.Row className="mt-2 mb-4 ml-3">
            <Form.Check disabled label={props.option.titleO} />
        </Form.Row>
    );
}

function SurveyOpenChoiceRow() {
    return (
        <Form.Row className="mt-3 mb-4">
        </Form.Row>
    );
}

export default AdminRead;