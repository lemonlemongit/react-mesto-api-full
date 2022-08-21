require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
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
 // const options = {
// origin: [
// 'http://localhost:3000',

// 'http://domainname.lemon.nomoredomains.sbs/',
// 'http://api.domainname.lemon.nomoredomains.sbs/',
// 'https://domainname.lemon.nomoredomains.sbs/',
// 'https://api.domainname.lemon.nomoredomains.sbs/',
// ],
// credentials: true,
// ;

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'http://domainname.lemon.nomoredomains.sbs/',
  'http://api.domainname.lemon.nomoredomains.sbs/',
  'https://domainname.lemon.nomoredomains.sbs',
  'https://api.domainname.lemon.nomoredomains.sbs',
  'localhost:3000',
];
const app = express();

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const requestHeaders = req.headers['access-control-request-headers']; // сохраняем список заголовков исходного запроса
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
   // res.header('Access-Control-Allow-Origin', allowedCors);
    res.header('Access-Control-Allow-Origin', origin);
   // res.header('Access-Control-Request-Header', 'https://domainname.lemon.nomoredomains.sbs');
  //  res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders, origin, X-Requested-With, Content-Type, Accept );
   // res.header('Access-Control-Allow-Credentials', true);
   /// res.header('Access-Control-Allow-Origin', allowedCors);
   return res.end();
  }
  next();
});

// app.all('*', cors(allowedCors));
// app.all('*', cors(options));
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
