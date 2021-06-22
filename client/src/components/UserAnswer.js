import { useState } from 'react';
import { Redirect, useLocation } from 'react-router'
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import API from '../API'

function UserAnswer(props) {

    const location = useLocation();
    const [toAnswer, setToAnswer] = useState(location.state ? location.state.survey : {});
    const [compiled, setCompiled] = useState({ idS: toAnswer.id, name: '', answers: [] });
    const [submitted, setSubmitted] = useState(false);
    const [loadingU, setLoadingU] = useState(false);
    const [errors, setErrors] = useState({ name: '', reqs: [] });

    const handleName = (value) => {
        setCompiled((old) => {
            return { ...old, name: value }
        });
    }
    
    const findFormErrors = () => {
        const newErrors = { name: '', reqs: [] };
        if (compiled.name === '')
            newErrors.name = 'Please insert your name!'
        const requiredQ = toAnswer.questions.filter(q => q.min === 1).map(r => r.id); // 7, 8
        if (requiredQ.length > 0) {
            if (compiled.answers.length === 0) {
                requiredQ.forEach(r => {
                    newErrors.reqs.push({ id: r, msg: 'This question is mandatory!' });
                })
            }
            else{
                requiredQ.forEach( r => {
                    if(!compiled.answers.map(a => a.idQ).includes(r)){
                        newErrors.reqs.push({ id: r, msg: 'This question is mandatory!' });
                    }
                    compiled.answers.filter(a => a.idQ===r).map(a => a.data).forEach(d => {
                        if(d.length===0 || d==="")
                            newErrors.reqs.push({ id: r, msg: 'This question is mandatory!' });
                    })
                })
            }
        }
        const over200 = compiled.answers.map(a => a.data).filter(d => d.length>200);
        console.log(compiled.answers.map(a => a.data).filter(d => d.length>200));
        if(over200.length>0)
            newErrors.over200 = "Cannot use more than 200 characters";
        return newErrors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const errs = findFormErrors();
        if (errs.name!=="" || errs.reqs.length > 0){
            console.log(errs);
            setErrors(errs);
        }
        else {
            setLoadingU(true);
            API.AddAnswerDB(compiled).then(() => {
                setLoadingU(false);
                setSubmitted(true);
            }).catch(err => console.log(err));
        }
    }
    return (
        <Container className="below-nav" fluid>
            <Row className="vheight-100 justify-content-center">
                <Col></Col>
                <Col lg={7} className="text-center">
                    <h2 className="mb-5">Compile the survey...</h2>
                    <Form>
                        <Col lg={12} className="mt-4 title-border">
                            <Form.Group>
                                <Form.Text as="h3" className="text-center mb-3">{toAnswer.title}</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Text as="h3" className="text-left mb-3 mt-3">Enter your name here: </Form.Text>
                            <Form.Control size="lg" type="input" isInvalid={!!errors.name} value={compiled.name ? compiled.name : ''} placeholder="Name" onChange={(event) => handleName(event.target.value)} />
                            <Form.Control.Feedback type="invalid"> {errors.name} </Form.Control.Feedback>
                        </Col>
                        <Form.Group className="mb-3 mt-5" controlId="formQuestion">
                            {toAnswer.questions ?
                                toAnswer.questions.map((q) => <UserAnswerRow key={q.id} question={q} questions={toAnswer.questions} compiled={compiled} reqs={errors.reqs} setCompiled={setCompiled} errors={errors}/>)
                                :
                                <Redirect to="/user" />
                            }
                            <Form.Text as="mark" className="mt-3 mb-3 text-left text-size"> Note: questions with the (*) mark are mandatory !</Form.Text>
                            <Button type="submit" variant="danger" >Cancel</Button>
                            <Button className="ml-3" type="submit" variant="success" onClick={(event) => handleSubmit(event)}>Answer</Button>
                            {loadingU ? <Spinner className="ml-4" animation="border" /> : <>{submitted ? <Redirect to="/user" /> : ''}</>}
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
                    <i><strong>{props.question.min ? '* ' : ''}Question # {props.questions.indexOf(props.question) + 1}</strong></i>
                    {props.question.min ?
                        <><Form.Control type="input" isInvalid={!!props.reqs.map(e => e.id).includes(props.question.id)} hidden />
                            <Form.Control.Feedback type="invalid">{props.reqs.map(r => r.msg)[0]}</Form.Control.Feedback></>
                        : ''}
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
                    <UserMultipleChoiceRow key={o.id} option={o} questions={props.questions} question={props.question} compiled={props.compiled}
                        setCompiled={props.setCompiled} max={props.question.max} />)
                    :
                    <UserOpenChoiceRow key={props.question.id} question={props.question} compiled={props.compiled} setCompiled={props.setCompiled} errors={props.errors}/>
                }
            </Container>
        </>

    );
}

function UserMultipleChoiceRow(props) {

    const addAnswer = (value) => {
        props.setCompiled((old) => {
            const o = old.answers;
            const c = o.filter(r => r.idQ === props.question.id);
            if (c.length === 0)
                return { ...old, answers: [...o, { idQ: props.question.id, data: [] }] };
            else return { ...old, answers: o };
        });
        addOptionAnswer(value);
    }

    const addOptionAnswer = (value) => {
        if (value) {
            props.setCompiled((old) => {
                const v = old.answers.map(a => {
                    if (a.idQ === props.question.id) {
                        const oldData = a.data;
                        if (oldData.length < props.max)
                            return { ...a, data: [...oldData, props.option.id] }
                        else {
                            oldData.shift();
                            return { ...a, data: [...oldData, props.option.id] }
                        }
                    }
                    else return a;
                })
                return { ...old, answers: v };
            })
        }
        else {
            props.setCompiled((old) => {
                const v = old.answers.map(a => {
                    if (a.idQ === props.question.id) {
                        const oldData = a.data.filter(d => d !== props.option.id);

                        return { ...a, data: oldData }
                    }
                    else return a;
                })
                return { ...old, answers: v };
            })
        }
    }

    return (
        <Form.Row className="mt-2 mb-4 ml-3">
            <Form.Check label={props.option.titleO}
                checked={props.compiled.answers.find(a => a.idQ === props.question.id)
                    ? props.compiled.answers.find(a => a.idQ === props.question.id).data.includes(props.option.id)
                    : false}
                onChange={(event) => addAnswer(event.target.checked)} />
        </Form.Row>
    );
}

function UserOpenChoiceRow(props) {

    const addAnswer = (value) => {
        props.setCompiled((old) => {
            const o = old.answers;
            const c = o.filter(r => r.idQ === props.question.id);
            if (c.length === 0)
                return { ...old, answers: [...o, { idQ: props.question.id, data: "" }] };
            else return { ...old, answers: o };
        });
        addOpenAnswer(value);
    }

    const addOpenAnswer = (value) => {

        if (value) {
            props.setCompiled((old) => {
                const v = old.answers.map(a => {
                    if (a.idQ === props.question.id) {
                        const oldData = a.data;
                        return { ...a, data: oldData.replace(oldData, value) }
                    }
                    else return a;
                })
                return { ...old, answers: v };
            })
        }
        else {
            props.setCompiled((old) => {
                const v = old.answers.map(a => {
                    if (a.idQ === props.question.id) {
                        return { ...a, data: '' }
                    }
                    else return a;
                })
                return { ...old, answers: v };
            })
        }
    }

    return (
        <Form.Row className="mt-3 mb-4">
            <Form.Control as="textarea" isInvalid={!!props.errors.over200} placeholder="max 200 characters" style={{ height: '150px' }} onChange={(event) => addAnswer(event.target.value)} />
            <Form.Control.Feedback type="invalid">{props.errors.over200}</Form.Control.Feedback>
        </Form.Row>
    );
}

export default UserAnswer;