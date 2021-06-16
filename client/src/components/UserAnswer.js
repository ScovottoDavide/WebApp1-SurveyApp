import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';

function UserAnswer(props){
    console.log(props.toAnswer);
    return(
        <Container className="below-nav" fluid>
            <Row className="vheight-100 justify-content-center">
                <Col></Col>
                <Col lg={7} className="text-center">
                    <h3 className="mb-5">Compile the survey...</h3>
                    <Form>
                        <Col sm={6} className="title-border">
                            <Form.Group>
                                <Form.Text as="h2" className="text-left mb-3">{props.toAnswer.title}</Form.Text>
                            </Form.Group>
                        </Col>
                        <Form.Group className="mb-3 mt-5" controlId="formQuestion">
                            {props.toAnswer.questions.map((q) => <UserAnswerRow key={q.id} question={q} questions={props.toAnswer.questions}/>)}
                            <Button type="submit" variant="danger" >Cancel</Button>
                            <Button className="ml-3" type="submit" variant="success" >Answer</Button>
                        </Form.Group>
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
                    <i><strong>Question # {props.questions.indexOf(props.question) + 1}</strong></i>
                </div>
                <Form.Row className="mt-3">
                    <Col>
                        <Form.Text as="h4" className="text-left mb-3">{props.question.titleQ}</Form.Text>
                    </Col>
                </Form.Row>
                {props.question.type ? props.question.options.map((o) =>
                    <UserMultipleChoiceRow key={o.id} option={o} questions={props.questions} question={props.question}  />)
                    :
                    <UserOpenChoiceRow />
                }
            </Container>
        </>

    );
}

function UserMultipleChoiceRow(props) {
    return (
        <Form.Row className="mt-3">
            <Col sm={6}>
                <InputGroup className="mb-3">
                    <InputGroup.Checkbox />
                    <Form.Text as="h4" className="text-left mb-3">{props.option.titleO}</Form.Text>
                </InputGroup>
            </Col>
        </Form.Row>
    );
}

function UserOpenChoiceRow(props){
    return (
        <Form.Row className="mt-3">
            <Form.Control as="textarea" className="mb-4"/>
        </Form.Row>
    );
}

export default UserAnswer;