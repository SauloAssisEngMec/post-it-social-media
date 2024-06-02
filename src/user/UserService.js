const User = require('./User');
const bcrypt = require('bcrypt');

const save = async (body) => {
  const hash = await bcrypt.hash(body.password, 12);
  const newUser = { ...body, password: hash };
  await User.create(newUser);
};

module.exports = { save };
