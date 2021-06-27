'use strict';

const db = require('./db');

// POST to create Survey in the db
exports.createSurvey = (survey) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO surveys(title, answers, userId) VALUES(?, ?, ?)';
        db.run(sql, [survey.title, survey.answers, survey.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}

exports.addQuestion = (question, idS) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO questions(titleQ, type, idS, min, max) VALUES(?, ?, ?, ?, ?)';
        db.run(sql, [question.titleQ, question.type, idS, question.min, question.max], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}

exports.addOption = (option, idQ) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO options(titleO, idQ) VALUES(?, ?)';
        db.run(sql, [option.titleO, idQ], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}

//GET the list of all surveys per admin 
exports.listSurveys = (userid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys WHERE userId=?';
        db.all(sql, [userid], async (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const questions = await this.listQuestions();
            const surveys = rows.map(r => ({ id: r.id, title: r.title, answers: r.answers, userId: r.userId, questions: questions.filter(q => q.idS === r.id) }));
            resolve(surveys);
        })
    })
}

exports.listQuestions = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM questions';
        db.all(sql, [], async (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const opts = await this.listOptions();
            const questions = rows.map(r => ({ id: r.idQ, titleQ: r.titleQ, type: r.type, idS: r.idS, min: r.min, max: r.max, options: opts.filter(o => o.idQ === r.idQ) }))
            resolve(questions);
        })
    })
}

exports.listOptions = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM options';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const options = rows.map((o) => ({ id: o.idO, titleO: o.titleO, idQ: o.idQ }));
            resolve(options);
        })
    })
}

exports.listAllSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys';
        db.all(sql, [], async (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const questions = await this.listQuestions();
            const surveys = rows.map((r) => ({ id: r.id, title: r.title, answers: r.answers, userId: r.userId, questions: questions.filter(q => q.idS === r.id) }));
            resolve(surveys);
        })
    })
}

exports.getAuthor = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name FROM users WHERE id = ?';
        db.get(sql, [userId], function (err, row){
            if(err){
                reject(err);
                return;
            }
            const name = row.name;
            resolve(name);
        })
    })
}

exports.addAnswer = (answers) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO answers(idS, name) VALUES(?, ?)';
        db.run(sql, [answers.idS, answers.name], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    })
}

exports.addAnswerData = (answer, idA) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO data_answers(idQ, data, idA) VALUES(?, ?, ?)';
        db.run(sql, [answer.idQ, answer.data.toString(), idA], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    })
}

exports.UpdateNumAnswers = (idS) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE surveys SET answers=answers+1 WHERE id=?';
            db.run(sql, [idS], function(err){
                if(err){
                    reject(err);
                    return;
                }
            })
            resolve(this.lastID);
    })
}

exports.getAnswers = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT answers.id, answers.idS, answers.name FROM answers, surveys WHERE surveys.userId=? AND surveys.id=answers.idS';
        db.all(sql, [userId], async (err, rows) => {
            if(err){
                reject(err);
                return;
            }
            const data_answer = await this.getDataAnswers();
            const answers = rows.map(r => ({id: r.id, idS: r.idS, name: r.name, data: data_answer.filter(a => a.idA===r.id)}));
            resolve(answers);
        })
    })
}

exports.getDataAnswers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM data_answers';
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
                return;
            }
            const data_answer = rows.map(r => ({id: r.id, idQ: r.idQ, data: r.data, idA: r.idA}));
            resolve(data_answer);
        })
    })
}