const Sequelize = require('sequelize');

const sequelize = new Sequelize('postit', 'my-user-db', 'fake-password', {
  dialect: 'sqlite',
  storage: './databse.sqlite',
  logging: false,
});

module.exports = sequelize;
