import { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { PlusCircle, Dash } from 'react-bootstrap-icons'

function AddSurvey() {
    const [titleSurvey, setTitleSurvey] = useState("");
    const [questions, setQuestions] = useState([{ id: 0, type: 1, options: [{id: 0, titleO: ""}] } ]);
    
    const setTitle = (value) => {
        setTitleSurvey(value);
    }

    const AddQuestion = () => {
        const q = {id: questions.length, type: 1, options: [{id: 0, titleO: ""}]};
        setQuestions(qs => [...qs, q]);
    }

    return (
        <Container className="below-nav" fluid>
            <Row className="vheight-100 justify-content-center">
                <Col className="color-col"></Col>
                <Col lg={7} className="text-center">
                    <h3 className="mb-5">Prepare a new survey to publish!</h3>
                    <Form>
                        <Col sm={6}> <Form.Control size="lg" type="input" placeholder="Untitled Survey" onChange={(event) => setTitle(event.target.value)}/> </Col>
                        <Form.Group className="mb-3 mt-5" controlId="formQuestion">
                            <Form.Row><h5 className="ml-3"> Click to add a new Question
                                <Button className="mb-2" size="md" variant="outline-ligth" onClick={() => AddQuestion()}> <PlusCircle /> </Button></h5></Form.Row>
                            {questions.map((q) => <QuestionRow key={q.id} question={q} questions={questions} setQuestions={setQuestions}/>)}
                        </Form.Group>
                    </Form>
                </Col>
                <Col className="color-col"> </Col>
            </Row>
        </Container>
    )
}

function QuestionRow(props) {
    const [choice, setChoice] = useState(true);  // true(1) = multiple , false(0) = open

    const handleChoice = (event) => {
        const value = event.target.value === "Multiple Choice" ? true : false;
        setChoice(value);
        const tipo = value === true ? 1 : 0
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id)
                    return {
                        ...q, type: tipo
                    };
                else return q;
            })
        });
    }

    const setTitle = (value) => {
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id)
                    return {
                        ...q, title: value
                    };
                else return q;
            })
        });
    }

    const deleteQuestion = (id) => {
        props.setQuestions(qs => qs.filter(q => q.id !== id));
    }

    return (
        <>
        <i><strong>Question # {props.question.id+1}</strong></i><Button className="ml-3 mb-1"variant="outline-danger" size="sm" onClick={()=>{deleteQuestion(props.question.id)}}><Dash /></Button>
        <Form.Row  className="mt-3">
            <Col><Form.Control type="text" placeholder="Enter Question" onChange={(event)=>setTitle(event.target.value)}/> </Col>
            <Col>
                <Form.Control as="select" onChange={(event) => handleChoice(event)} >
                    <option>Multiple Choice</option>
                    <option>Open Answer</option>
                </Form.Control></Col>
        </Form.Row>
            {choice && props.question.options.map( (o) => <MultipleChoiceRow key={o.id} option={o} question={props.question} setQuestions={props.setQuestions} />)}
            {!choice && <OpenChoiceRow />}</>
    );
}

function MultipleChoiceRow(props) {
    const AddOption = () => {
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id){
                    const opt = q.options;
                    return {
                        ...q, options: [...opt, {id: opt.length, title: ""}]
                    }
                }
                else return q;    
            })
        });
    }

    return (
        <Form.Row className="mt-3">
            <Col sm={6}>
                <InputGroup className="mb-3">
                    <InputGroup.Checkbox />
                    <Form.Control placeholder="Option 1" />
                </InputGroup>
            </Col>
            {props.option.id===props.question.options.length - 1 ? 
                <Col sm={1}><Button className="mt-1" size="sm" variant="outline-success" onClick={AddOption}> <PlusCircle /> </Button> </Col> : ''}
        </Form.Row>
    );
}

function OpenChoiceRow() {
    return (
        <Form.Row className="mt-3">
        </Form.Row>
    );
}
export default AddSurvey;