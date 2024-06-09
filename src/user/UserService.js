const User = require('./User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const createToken = (length) => {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
};

const save = async (body) => {
  const { userName, email } = body;
  const hash = await bcrypt.hash(body.password, 12);
  const newUser = {
    userName,
    email,
    password: hash,
    activationToken: createToken(16),
  };
  await User.create(newUser);
};

module.exports = { save };
