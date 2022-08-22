const Card = require('../models/card');
const NotFound = require('../errors/error404');
const Forbidden = require('../errors/error403');
const BadRequest = require('../errors/error400');

// создания карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id; // _id станет доступен

  Card.create({
    name,
    link,
    owner,
  })
    // вернём записанные в базу данные
    .then((card) => res.send( card ))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((next));
};

// удаляет карточку по id
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      } if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Можно удалять только свои карточки!');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch(next);
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};
