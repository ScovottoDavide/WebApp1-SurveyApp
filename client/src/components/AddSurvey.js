import { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { PlusCircle, Arrow90degDown, Arrow90degUp, XSquare, Trash } from 'react-bootstrap-icons'
import { NavLink } from 'react-router-dom'
import { Redirect } from 'react-router'

function AddSurvey(props) {
    const [titleSurvey, setTitleSurvey] = useState("");
    const [questions, setQuestions] = useState([]);
    const [errors, setErrors] = useState({});
    const [published, setPublished] = useState(false);

    const setTitle = (value) => {
        setTitleSurvey(value);
    }

    const AddQuestion = () => {
        const lastId = props.inFormQuestions.length === 0 ? 0 : props.inFormQuestions[props.inFormQuestions.length - 1].id;
        const q = { id: lastId + questions.length + 1, type: 1, min: 0, max: 1, options: [{ id: 0, titleO: "", idQ: questions.length }] };
        setQuestions(qs => [...qs, q]);
        setErrors({});
    }

    const findFormErrors = () => {
        const newErrors = {};
        if (titleSurvey === '')
            newErrors.titleS = "Cannot be blank";
        if (questions.length !== 0) {
            questions.forEach(q => {
                if (q.titleQ === undefined || q.titleQ === "")
                    newErrors.titleQ = "Cannot be blank";
                if (q.type === 1) {
                    q.options.forEach(o => {
                        if (o.titleO === '') newErrors.titleO = "Cannot be blank";
                    })
                }
            })
        }
        else newErrors.noQs = "Insert at least one question!";
        return newErrors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const errs = findFormErrors();
        if (Object.keys(errs).length > 0)
            setErrors(errs);
        else {
            const newSurvey = { id: props.surveys.length + 1, title: titleSurvey, answers: 0, questions: questions };
            props.surveyAdder(newSurvey);
            props.setDirty(true);
            props.setLoadingA(true);
            setPublished(true);
        }
    }

    return (
        <Container className="below-nav sfondo" fluid>
            <Row className="vheight-100 justify-content-center">
                <Col></Col>
                <Col lg={7} className="text-center">
                    <h3 className="mb-5">Prepare a new survey to publish!</h3>
                    <Form>
                        <Col sm={6} className="title-border">
                            <Form.Group>
                                <Form.Text as="h4" className="text-left mb-3">Choose a title...</Form.Text>
                                <Form.Control size="md" type="input" isInvalid={!!errors.titleS} value={titleSurvey ? titleSurvey : ''} placeholder="Untitled" onChange={(event) => setTitle(event.target.value)} />
                                <Form.Control.Feedback type="invalid"> {errors.titleS} </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Form.Group className="mb-3 mt-5" controlId="formQuestion">
                            <Form.Row>
                                <h5 className="ml-3"> Click to add a new Question
                                    <Button className="mb-2" size="md" variant="outline-ligth" onClick={() => AddQuestion()}> <PlusCircle /> </Button>
                                    {questions.length===0 ? <><Form.Control type="input" isInvalid={!!errors.noQs} hidden />
                                    <Form.Control.Feedback type="invalid">{errors.noQs}</Form.Control.Feedback> </>: ''}
                                </h5>

                            </Form.Row>
                            {questions.map((q) => <QuestionRow key={q.id} question={q} questions={questions} setQuestions={setQuestions} errors={errors} />)}
                            <NavLink to="/admin"><Button type="submit" variant="danger"  onClick={() => {props.setDirty(true);props.setLoadingA(true)}}>Cancel</Button></NavLink>
                            {published ? <Redirect to="/admin" /> : <Button className="ml-3" type="submit" variant="success" onClick={(event) => handleSubmit(event)}>Publish</Button>}
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
        if (value) {
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
        else {
            props.setQuestions((oldQuestions) => {
                return oldQuestions.map((q) => {
                    if (q.id === props.question.id)
                        return {
                            ...q, titleQ: ''
                        };
                    else return q;
                })
            });
        }
    }

    const deleteQuestion = (id) => {
        props.setQuestions(qs => qs.filter(q => q.id !== id));
    }

    const arrMove = (arr, fromIndex, toIndex) => {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }

    const handleUp = () => {
        const i = props.questions.indexOf(props.question); // index of selected question
        const j = i - 1; // index of top question

        if (props.questions.length === 1) {
            return;
        }
        if (props.questions.length > 1) {
            if (props.questions[i] === props.questions[0]) {
                // trying to move already the top one
                return;
            }
        }

        arrMove(props.questions, i, j);

        props.setQuestions([...props.questions]);
    }

    const handleDown = () => {
        const i = props.questions.indexOf(props.question);
        const j = i + 1;

        if (props.questions.length === 1) {
            return;
        }
        if (props.questions.length > 1) {
            if (props.questions[i] === props.questions[props.questions.length - 1]) {
                // trying to move already the bot one
                return;
            }
        }

        arrMove(props.questions, i, j);

        props.setQuestions([...props.questions]);

    }

    const handleMin = (value) => {
        if (value)
            props.question.min = 1;
        else props.question.min = 0;
        props.setQuestions([...props.questions]);
    }

    const handleMax = (value) => {
        props.question.max = value;
        props.setQuestions([...props.questions]);
    }

    return (
        <>
            <Container className="question-border mb-5">
                <div className="mt-4">
                    <i><strong>Question # {props.questions.indexOf(props.question) + 1}</strong></i><Button className="ml-3 mb-1" variant="outline-danger" size="sm" onClick={() => { deleteQuestion(props.question.id) }}><Trash /></Button>
                    <Button className="ml-3 mb-1" variant="outline-success" size="sm"><Arrow90degDown onClick={handleDown} /></Button>
                    <Button className="ml-3 mb-1" variant="outline-success" size="sm"><Arrow90degUp onClick={handleUp} /></Button>
                </div>
                <Form.Row className="mt-3 mb-2">
                    <Col className="d-flex justify-content-left">
                        <Form.Switch custom id={props.question.id} label="Required" checked={props.question.min ? props.question.min : 0} onChange={(event) => handleMin(event.target.checked)} />
                    </Col>
                    <Col>
                        <Form.Label>Select max answerable options</Form.Label>
                    </Col>
                    <Col sm={3}>
                        <Form.Control as="select" value={props.question.max ? props.question.max : 1} custom onChange={(event) => handleMax(event.target.value)}>
                            {choice ? props.question.options.map(o =>
                                <option key={o.id}>{o.id + 1}</option>
                            ) : <option>1</option>
                            }
                        </Form.Control>
                    </Col>
                </Form.Row>
                <Form.Row className="mt-3">
                    <Col>
                        <Form.Control type="text" placeholder="Enter Question" isInvalid={!props.question.titleQ && !!props.errors.titleQ}
                            value={props.question.titleQ ? props.question.titleQ : ''} onChange={(event) => setTitle(event.target.value)} />
                        {props.question.titleQ===undefined || props.question.titleQ==="" ? <Form.Control.Feedback type="invalid"> {props.errors.titleQ} </Form.Control.Feedback> : ''}
                    </Col>
                    <Col>
                        <Form.Control as="select" onChange={(event) => handleChoice(event)} >
                            <option>Multiple Choice</option>
                            <option>Open Answer</option>
                        </Form.Control>
                    </Col>
                </Form.Row>
                {choice && props.question.options.map((o) =>
                    <MultipleChoiceRow key={o.id} option={o} questions={props.questions} question={props.question} setQuestions={props.setQuestions} errors={props.errors} />)
                }
                {!choice && <OpenChoiceRow />}
            </Container>
        </>

    );
}

function MultipleChoiceRow(props) {
    const [errorMsg, setErrorMsg] = useState('');

    const AddOption = () => {
        if (props.question.options.length < 10) {
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
        else setErrorMsg("Cannot have more than 10 options");
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

    const arrDelete = (arr, Index) => {
        arr.splice(Index, 1);
    }

    const deleteOption = (id) => {
        const tmp = props.question.options[id + 1].id;
        props.question.options[id + 1].id = props.question.options[id].id
        props.question.options[id].id = tmp;

        arrDelete(props.question.options, id);
        for(let i=id+1; i<props.question.options.length; i++)
            props.question.options[i].id -= 1;

        props.setQuestions([...props.questions]);
    }
    
    return (
        <Form.Row className="mt-3">
            <Col sm={6}>
                <InputGroup className="mb-3">
                    <InputGroup.Checkbox disabled/>
                    <Form.Control placeholder="Write Option" isInvalid={props.option.titleO==="" && !!props.errors.titleO} 
                    value={props.option.titleO ? props.option.titleO : ''} onChange={(event) => setTitleO(event.target.value)} />
                    {props.option.titleO==="" ? <Form.Control.Feedback type="invalid"> {props.errors.titleO} </Form.Control.Feedback> : ''}
                </InputGroup>
            </Col>
            {props.option.id === props.question.options.length - 1 ?
                <Col sm={1}>
                    <Button className="mt-1" size="sm" variant="outline-success" onClick={AddOption}>
                        <PlusCircle />
                    </Button>
                </Col>
                :
                <Col sm={1}><Button className="mt-1" size="sm" variant="outline-warning" onClick={() => { deleteOption(props.option.id) }}> <XSquare /> </Button> </Col>}
            {errorMsg && <Alert className="alert small" variant="warning" size="sm" onClick={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
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