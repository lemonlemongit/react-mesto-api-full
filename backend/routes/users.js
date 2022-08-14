const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexp } = require('../regexp/regexp');

const {
  // createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

// router.post('/users', createUser);
router.get('/', getUsers);
router.get('/me', getUserInfo);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(regexp),
    }),
  }),
  updateAvatar,
);

module.exports = router;
