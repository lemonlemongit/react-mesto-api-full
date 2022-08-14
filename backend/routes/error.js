const routError = require('express').Router();
const NotFound = require('../errors/error404');

routError.all('*', (req, res, next) => {
  next(new NotFound('Такого роута не сущесвтует'));
});
module.exports = routError;
