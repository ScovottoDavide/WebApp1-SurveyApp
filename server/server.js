'use strict';
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const { check, validationResult } = require("express-validator");
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const dao = require('./dao');
const userDao = require('./user-dao');

/*** Set up Passport ***/
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password ' });

      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id).then((user) => {
    done(null, user); // req.user
  })
    .catch((err) => {
      done(err, null);
    });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authorized!' });
}

// init express
const app = new express();
const port = 3001;

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json());

app.use(session({
  // set up here express-session
  secret: 'una frase segreta da non condividere, usata per firmare il cookie Session ID',
  resave: false,
  saveUninitialized: false,
}));

//init passport to use sessions
app.use(passport.initialize());
app.use(passport.session());


/*** User APIs ***/
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user)
      return res.status(401).json(info);

    req.login(user, (err) => {
      if (err)
        return next(err);
      return res.json(req.user);
    })
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated())
    res.status(200).json(req.user);
  else
    res.status(401).json({ error: 'Not authenticated' });
})

app.post('/api/logout', (req, res) => {
  req.logout();
  res.end();
});

/* SURVEY DB API's */

//create a new survey
app.post('/api/addSurvey', [
  check('id').isInt({ min: 0 }),
  check('title').notEmpty(),
  check('answers').isInt({ min: 0 }),
  check('questions').isArray({ min: 1 })
], isLoggedIn, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })
  const newSurvey = {
    id: req.body.id,
    title: req.body.title,
    answers: req.body.answers,
    user: req.user.id,
    questions: req.body.questions,
  };
  try {
    const id1 = await dao.createSurvey(newSurvey);

    for (let i = 0; i < newSurvey.questions.length; i++) {
      if (newSurvey.questions[i].type !== 0) {
        const id2 = await dao.addQuestion(newSurvey.questions[i], id1);
        for (let j = 0; j < newSurvey.questions[i].options.length; j++) {
          await dao.addOption(newSurvey.questions[i].options[j], id2);
        }
      }
      else
        await dao.addQuestion(newSurvey.questions[i], id1);
    }
    res.status(201).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during creation of survey ${newSurvey.title}` })
  }
})

//create a new answer
app.post('/api/AddAnswer', [
  check('idS').isInt({ min: 1 }),
  check('name').notEmpty(),
  check('answers').isArray()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })
  const newAnswer = {
    idS: req.body.idS,
    name: req.body.name,
    answers: req.body.answers,
  };
  try {
    const id1 = await dao.addAnswer(newAnswer);
    newAnswer.answers.forEach(async answer => {
      await dao.addAnswerData(answer, id1);
    })
    await dao.UpdateNumAnswers(newAnswer.idS);
    res.status(201).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during creation of answer from ${newAnswer.name}` });
  }
})

// Get the list of all surveys per admin 
app.get('/api/surveys', isLoggedIn, async (req, res) => {
  try {
    setTimeout(async () => {
      const surveys = await dao.listSurveys(req.user.id);
      res.json(surveys);
    }, 1000);
  } catch (err) {
    res.status(500).end();
  }
})

// Get the list of all surveys of all users
app.get('/api/surveys/all', async (req, res) => {
  try {
    setTimeout(async () => {
      const all = await dao.listAllSurveys();
      for (let i = 0; i < all.length; i++) {
        var element = all[i];
        const author = await dao.getAuthor(element.userId);
        all[i].author = author;
      }
      res.json(all);
    }, 1000)
  } catch (err) {
    res.status(503).end();
  }
})

// Get the list of all questions
app.get('/api/surveys/questions', isLoggedIn, async (req, res) => {
  try {
    const questions = await dao.listQuestions();
    res.json(questions);
  } catch (err) {
    res.status(500).end();
  }
})

// Get the list of all answers
app.get('/api/answers', isLoggedIn, async (req, res) => {
  try {
    const answers = await dao.getAnswers(req.user.id);
    res.json(answers);
  } catch (err) {
    res.status(500).end();
  }
})

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});