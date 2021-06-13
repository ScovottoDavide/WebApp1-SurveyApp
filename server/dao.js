'use strict';

const db = require('./db');

// POST to create Survey in the db
exports.createSurvey = (survey) => {
    return new Promise((resolve, reject) => {
        console.log(survey);
        survey.questions.forEach(question => {
            this.addQuestion(question, survey.id);
        });
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
        console.log(question);
        question.options.forEach(option => {
            this.addOption(option, question.id);
        })
        const sql = 'INSERT INTO questions(idQ, titleQ, type, idS, mandatory) VALUES(?, ?, ?, ?, ?)';
        db.run(sql, [question.id, question.titleQ, question.type, idS, 0], function (err) {
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
        console.log(option);
        const sql = 'INSERT INTO options(idO, titleO, idQ) VALUES(?, ?, ?)';
        db.run(sql, [option.id, option.titleO, idQ], function (err) {
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