import { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Card } from 'react-bootstrap';
import { PlusCircle, Dash, Arrow90degDown, Arrow90degUp } from 'react-bootstrap-icons'
import { Redirect } from 'react-router';

function AddSurvey(props) {
    const [titleSurvey, setTitleSurvey] = useState("");
    const [questions, setQuestions] = useState([]);

    const setTitle = (value) => {
        setTitleSurvey(value);
    }

    const AddQuestion = () => {
        const lastId = props.inFormQuestions.length === 0 ? 0 : props.inFormQuestions[props.inFormQuestions.length - 1].id;
        const q = { id: lastId + questions.length + 1, type: 1, options: [{ id: 0, titleO: "", idQ: questions.length }] };
        setQuestions(qs => [...qs, q]);
        console.log(questions);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const newSurvey = { id: props.surveys.length + 1, title: titleSurvey, questions: questions };
        props.surveyAdder(newSurvey);
        props.setCompiling(false);
    }

    return (
        <Container className="below-nav" fluid>
            <Row className="vheight-100 justify-content-center">
                <Col></Col>
                <Col lg={7} className="text-center">
                    <h3 className="mb-5">Prepare a new survey to publish!</h3>
                    <Form>
                        <Col sm={6}> <Form.Control size="lg" type="input" placeholder="Untitled Survey" onChange={(event) => setTitle(event.target.value)} /> </Col>
                        <Form.Group className="mb-3 mt-5" controlId="formQuestion">
                            <Form.Row><h5 className="ml-3"> Click to add a new Question
                                <Button className="mb-2" size="md" variant="outline-ligth" onClick={() => AddQuestion()}> <PlusCircle /> </Button></h5></Form.Row>
                            {questions.map((q) => <QuestionRow key={q.id} question={q} questions={questions} setQuestions={setQuestions} />)}
                            <Button type="submit" variant="danger">Cancel</Button>
                            <Button className="ml-3" type="submit" variant="success" onClick={(event) => handleSubmit(event)}>Publish</Button>
                            {props.compiling ? '' : <Redirect to="/admin" />}
                        </Form.Group>
                    </Form>
                </Col>
                <Col> </Col>
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
                        ...q, titleQ: value
                    };
                else return q;
            })
        });
    }

    const deleteQuestion = (id) => {
        props.setQuestions(qs => qs.filter(q => q.id !== id));
    }

    const handleUp = () => {
        const i = props.questions.indexOf(props.question); // index of selected question
        const j = i - 1; // index of top question
        
        if(props.questions.length===1){
            console.log("1" + props.questions.length);
            return ;
        }
        if(props.questions.length > 1){
            if(props.questions[i] === props.questions[0]){
                console.log("2" + props.questions[i] + " " + props.questions[0]);
                // trying to move already the top one
                return ;
            }
            else{
            }
        }
        const tmp = props.questions[i];
        console.log(tmp);
        props.questions[i] = props.questions[j];
        console.log(props.questions[i]);
        props.question[j] = tmp; 
        console.log(props.questions[j]);
        console.log("sc " + props.questions);
        props.setQuestions(props.questions);
    }

    return (
        <>
            <div className="mt-4">
                <i><strong>Fill up your question...</strong></i><Button className="ml-3 mb-1" variant="outline-danger" size="sm" onClick={() => { deleteQuestion(props.question.id) }}><Dash /></Button>
                <Button className="ml-3 mb-1" variant="outline-success" size="sm"><Arrow90degDown /></Button>
                <Button className="ml-3 mb-1" variant="outline-success" size="sm"><Arrow90degUp onClick={handleUp}/></Button>
            </div>
            <Form.Row className="mt-3">
                <Col><Form.Control type="text" placeholder="Enter Question" onChange={(event) => setTitle(event.target.value)} /> </Col>
                <Col>
                    <Form.Control as="select" onChange={(event) => handleChoice(event)} >
                        <option>Multiple Choice</option>
                        <option>Open Answer</option>
                    </Form.Control></Col>
            </Form.Row>
            {choice && props.question.options.map((o) => <MultipleChoiceRow key={o.id} option={o} questions={props.questions} question={props.question} setQuestions={props.setQuestions} />)}
            {!choice && <OpenChoiceRow />}
        </>

    );
}

function MultipleChoiceRow(props) {
    const AddOption = () => {
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id) {
                    const opt = q.options;
                    return {
                        ...q, options: [...opt, { id: opt.length, titleO: "", idQ: props.questions.length }]
                    }
                }
                else return q;
            })
        });
    }

    const setTitleO = (value) => {
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id) {
                    const opt = q.options;
                    return {
                        ...q, options: opt.map((o) => {
                            if (o.id === props.option.id)
                                return { ...o, titleO: value }
                            else return o;
                        })
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
                    <Form.Control placeholder="Option 1" onChange={(event) => setTitleO(event.target.value)} />
                </InputGroup>
            </Col>
            {props.option.id === props.question.options.length - 1 ?
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