'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('survey.db', (err) => {
    if (err) throw err;
});

module.exports = db;