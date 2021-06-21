
/* ADMIN LOGIN-LOGOUT-INFO API's */
async function login(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.json();
        throw errDetails.message;
    }
}

async function getUserInfo() {
    const response = await fetch('/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    }
    else throw userInfo;
}

async function logout() {
    let response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (response.ok) {
        return true;
    }
    else
        return false;
}

/* SURBEY DB API's */
function AddSurveyDB(survey){
    // call POST /api/addSurvey
    return new Promise((resolve, reject) => {
        const s = {id: survey.id, title: survey.title, answers: survey.answers, questions: survey.questions};
        fetch('/api/addSurvey', {
            method: 'POST', 
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(s),
        }).then((response) => {
            if(response.ok)
                resolve();
            else response.json().then(obj => reject(obj));
        }).catch(err => reject({error: 'Comunication problems!'}))
    })
}

async function RetrieveSurveyList() {
    // call GET /api/surveys
    const response = await fetch('/api/surveys');
    const list = await response.json();
    if (response.ok)
        return list.map( l => ({id: l.id, title: l.title, answers: l.answers, userId: l.userId, questions: l.questions}));
    else throw list;
}

async function RetrieveQuestionsList() {
    // call GET /api/surveys/questions
    const response = await fetch('/api/surveys/questions');
    const list = await response.json();
    if (response.ok)
        return list;
    else throw list;
}

async function RetrieveAllSurveys(){
    // call GET /api/surveys/all
    const response = await fetch('/api/surveys/all');
    const list = await response.json();
    if (response.ok)
        return list.map( l => ({id: l.id, title: l.title, author: l.author, answers: l.answers, userId: l.userId, questions: l.questions}));
    else throw list;
}

function AddAnswerDB(compiled){
    // call POST /api/addAnswer
    return new Promise((resolve, reject) => {
        const a = {idS: compiled.idS, name: compiled.name, answers: compiled.answers};
        fetch('/api/AddAnswer', {
            method: 'POST', 
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(a),
        }).then((response) => {
            if(response.ok)
                resolve();
            else response.json().then(obj => reject(obj));
        }).catch(err => reject(err))
    })
}

const API = {login, getUserInfo, logout, AddSurveyDB, RetrieveSurveyList, RetrieveQuestionsList, RetrieveAllSurveys, AddAnswerDB};
export default API;