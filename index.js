const app = require('./src/app');
const sequelize = require('./src/config/database');
const port = 3333;

sequelize.sync({ force: true });

console.log('env ' + process.env.NODE_ENV);
app.listen(port, () => {
  console.log(`the app is runnin on port http://localhost:${port}`);
});
