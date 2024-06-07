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
// const customBail = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const validationErrors = {};
//     errors
//       .array()
//       .forEach((error) => (validationErrors[error.path] = error.msg));
//     return res.status(400).send({ validationErrors: validationErrors });
//   }
//   next();
// };

router.post(
  '/api/v1/users',
  check('userName')
    .notEmpty()
    .withMessage('userName cant be null')
    .bail()
    .isLength({ min: 4 })
    .withMessage('This must be between 4 to 27 characters')
    .bail()
    .isLength({ max: 27 })
    .withMessage('This must be between 4 to 27 characters'),
  check('email')
    .notEmpty()
    .withMessage('E-mail cant be null')
    .bail()
    .isEmail()
    .withMessage('E-mail is not valid'),
  check('password')
    .notEmpty()
    .withMessage('Password cant be null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('password must has at least 6 characters')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage(
      'password must have at leats 1 UPPERCASE, 1 lowercase and one character',
    ),
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
