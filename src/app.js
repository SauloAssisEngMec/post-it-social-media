const express = require('express');
const User = require('./user/User');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

app.post('/api/v1/users', (req, res) => {
  bcrypt.hash(req.body.password, 12).then(function (hash) {
    const newUser = { ...req.body, password: hash };
    User.create(newUser).then(() => {
      res.send({ message: 'success message' });
    });
  });
  // User.create(req.body).then(() => {
  //   res.send({ message: 'success message' });
  // });
});

module.exports = app;
