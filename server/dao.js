'use strict';

const db = require('./db');

// POST to create Survey in the db
exports.createSurvey = (survey) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO surveys(title) VALUES(?)';
        db.run(sql, [survey.title], function (err) {
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

//GET the list of all surveys
exports.listSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys';
        db.all(sql, [], async (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const questions = await this.listQuestions();
            const surveys = rows.map(r => ({ id: r.id, title: r.title, questions: questions}));
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
            const questions = rows.map(r => ({ id: r.idQ, titleQ: r.titleQ, type: r.type, options: opts.filter(o => o.idQ === r.idQ) }))
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