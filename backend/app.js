const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { regexp } = require('./regexp/regexp');
// const { NOT_FOUND } = require('./errors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// импортируем роутеры
const routUsers = require('./routes/users');
const routcards = require('./routes/cards');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const options = {
  origin: [
    'http://localhost:3000',
    'https://github.com/lemonlemongit',
    'http://domainname.lemon.nomoredomains.sbs/',
    'http://api.domainname.lemon.nomoredomains.sbs/',
  ],
  credentials: true,
};

const app = express();
app.all('*', cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

// Kраш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роуты, не требующие авторизации
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regexp),
    }),
  }),
  createUser,
);

// роуты, требующие авторизации
app.use(auth);
app.use('/users', routUsers);
app.use('/cards', routcards);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Сервер вернул ошибку' : message });
  next();
});

app.listen(PORT);
