const express = require('express');
const UserService = require('./UserService');

const router = express.Router();

const validateUserName = (req, res, next) => {
  const user = req.body;
  if (user.userName === null) {
    req.validationErrors = {
      userName: 'userName cant be null',
    };
    // return res
    //   .status(400)
    //   .send({ validationErrors: { userName: 'userName cant be null' } });
  }
  next();
};

const validateEmail = (req, res, next) => {
  const user = req.body;
  if (user.email === null) {
    req.validationErrors = {
      ...req.validationErrors,
      email: 'E-mail cant be null',
    };
    // return res
    //   .status(400)
    //   .send({ validationErrors: { email: 'E-mail cant be null' } });
  }
  next();
};

router.post(
  '/api/v1/users',
  validateUserName,
  validateEmail,
  async (req, res) => {
    if (req.validationErrors) {
      const response = { validationErrors: { ...req.validationErrors } };
      return res.status(400).send(response);
    }
    await UserService.save(req.body);
    return res.send({ message: 'success message' });
  },
);

module.exports = router;
