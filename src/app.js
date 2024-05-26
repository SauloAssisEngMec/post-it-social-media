const express = require('express');

const app = express();

app.post('/api/v1/users', (req, res) => {
  res.status(200).send({ message: 'success message' });
});

module.exports = app;
