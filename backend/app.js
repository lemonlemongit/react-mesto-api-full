require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { regexp } = require('./regexp/regexp');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// импортируем роутеры
const routUsers = require('./routes/users');
const routcards = require('./routes/cards');

// Слушаем порт
const { PORT = 3000 } = process.env;

// Массив доменов, с которых разрешены кросс-доменные запросы

const app = express();

app.use(
  cors({
    origin: [
      'http://domainname.lemon.nomoredomains.sbs',
      'http://api.domainname.lemon.nomoredomains.sbs',
      'https://domainname.lemon.nomoredomains.sbs',
      'https://api.domainname.lemon.nomoredomains.sbs',
      'localhost:3000',
    ],
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(helmet());
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
app.use('*', (_req, _res, next) => {
  next();
});
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Сервер вернул ошибку' : message });
  next();
});

app.listen(PORT);
