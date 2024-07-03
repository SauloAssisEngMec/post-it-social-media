const User = require('./User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const nodemailerStub = require('nodemailer-stub');

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
  // create User
  await User.create(newUser);

  //Account Activation
  const transporter = nodemailer.createTransport(nodemailerStub.stubTransport);
  await transporter.sendMail({
    from: 'app test <postit@mail.com>',
    to: email,
    subject: 'account Activation',
    html: `the token to actvate your account is ${newUser.activationToken}`,
  });

  //
};

module.exports = { save };
