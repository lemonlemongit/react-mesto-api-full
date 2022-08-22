const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequest = require('../errors/error400');
const ConflictingRequest = require('../errors/error409');
const NotFound = require('../errors/error404');

const { NODE_ENV, JWT_SECRET } = process.env;
// создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({ name, about, avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Вы ввели некорректные данные'));
        return;
      } if (err.code === 11000) {
        next(new ConflictingRequest('Введите другой email'));
        return;
      }
      next(err);
    });
};

// возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((userList) => res.send(userList))
    .catch((err) => next(err));
};

// возвращает пользователя по id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFound('Такого пользователя нет'));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Невалидный id'));
      } else {
        next(error);
      }
    });
};

// обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  // const userId = req.user._id;
  User.findByIdAndUpdate(
   // { _id: userId },
    req.user._id,
    { name, about },
    { 
      new: true, 
      runValidators: true, 
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// обновляет аватар пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  // const userId = req.user._id;
  User.findByIdAndUpdate(
    req.user._id,
   // { _id: userId },
    { avatar },
    {  new: true,  runValidators: true,  upsert: false },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// проверит email, password? ок => создаст токен
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id,
      }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

// получение информации о пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(
      {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    ))
    .catch((err) => next(err));
};
