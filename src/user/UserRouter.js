const express = require('express');
const UserService = require('./UserService');
const { ValidationError } = require('sequelize');
const router = express.Router();

router.post('/api/v1/users', async (req, res) => {
  const user = req.body;
  if (user.userName === null) {
    return res
      .status(400)
      .send({ validationErrors: { userName: 'userName cant be null' } });
  }
  await UserService.save(req.body);
  return res.send({ message: 'success message' });
});

module.exports = router;
