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

//GET the list of all surveys per user 
exports.listSurveys = (userid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys WHERE userId=?';
        db.all(sql, [userid], async (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const questions = await this.listQuestions();
            const surveys = rows.map(r => ({ id: r.id, title: r.title, answers: r.answers, userId: r.userId, questions: questions.filter(q => q.idS === r.id)}));
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
            if(err){
                reject(err);
                return;
            }
            const questions = await this.listQuestions();
            const surveys = rows.map((r) => ({ id: r.id, title: r.title, answers: r.answers, userId: r.userId, questions: questions.filter(q => q.idS === r.id)}));
            resolve(surveys);
        })
    })
}