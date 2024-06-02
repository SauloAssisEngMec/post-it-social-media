const Sequelize = require('sequelize');
const config = require('config');

const dBconfig = config.get('database');

const sequelize = new Sequelize(
  dBconfig.database,
  dBconfig.username,
  dBconfig.password,
  {
    dialect: dBconfig.dialect,
    storage: dBconfig.storage,
    logging: false,
  },
);

module.exports = sequelize;
