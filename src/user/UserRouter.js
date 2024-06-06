const express = require('express');
const UserService = require('./UserService');

const router = express.Router();
const { check, validationResult } = require('express-validator');

// const validateUserName = (req, res, next) => {
//   const user = req.body;
//   if (user.userName === null) {
//     req.validationErrors = {
//       userName: 'userName cant be null',
//     };
//   }
//   next();
// };

// const validateEmail = (req, res, next) => {
//   const user = req.body;
//   if (user.email === null) {
//     req.validationErrors = {
//       ...req.validationErrors,
//       email: 'E-mail cant be null',
//     };
//   }
//   next();
// };

router.post(
  '/api/v1/users',
  check('userName').notEmpty().withMessage('userName cant be null'),
  check('email').notEmpty().withMessage('E-mail cant be null'),
  check('password').notEmpty().withMessage('Password cant be null'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = {};
      errors
        .array()
        .forEach((error) => (validationErrors[error.path] = error.msg));
      return res.status(400).send({ validationErrors: validationErrors });
    }
    await UserService.save(req.body);
    return res.send({ message: 'success message' });
  },
);

module.exports = router;
