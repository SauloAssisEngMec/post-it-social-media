const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/User');
const sequelize = require('../src/config/database');

const defaultUser = {
  userName: 'saulo1',
  email: 'saulo1@mail.com',
  password: 'P4ssword',
};

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({
    truncate: true,
  });
});

describe('Register: User', () => {
  test('it should return status code 200 when singup request is valid', async () => {
    // first  way (with then and done)
    //request(app).get('/api/v1/users').send(defaultUser).expect(200, done);
    // 2 second  way (with then and done)
    // request(app)
    //   .post('/api/v1/users')
    //   .send(defaultUser)
    //   .then((response) => {
    //     expect(response.status).toBe(200);
    //     done();
    //   });
    // third  way (with async awy - recomended)
    const response = await request(app).post('/api/v1/users').send(defaultUser);

    expect(response.status).toBe(200);
  });

  test('it should return success message if singup request is valid', async () => {
    const response = await request(app).post('/api/v1/users').send(defaultUser);

    expect(response.body.message).toBe('success message');
  });

  test('it should save user to database', async () => {
    await request(app).post('/api/v1/users').send(defaultUser);

    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  test('it should save user to database and check if email and name is correct', async () => {
    //request(app).get('/api/v1/users').send(defaultUser).expect(200, done);
    await request(app).post('/api/v1/users').send(defaultUser);

    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.userName).toBe(defaultUser.userName);
    expect(savedUser.email).toBe(defaultUser.email);
  });

  test('it should hash password', async () => {
    await request(app).post('/api/v1/users').send(defaultUser);

    const userList = await User.findAll();
    const savedUser = userList[0];

    expect(savedUser.password).not.toBe(defaultUser.password);
  });

  test('it should return status code 400', async () => {
    const nullUser = Object.assign({}, defaultUser, { userName: null });

    const response = await request(app).post('/api/v1/users').send(nullUser);

    expect(response.status).toBe(400);
  });

  test('it should return validationErrors when validation errors occurs', async () => {
    const nullUser = Object.assign({}, defaultUser, { userName: null });

    const response = await request(app).post('/api/v1/users').send(nullUser);
    const body = response.body;

    expect(body.validationErrors).not.toBeUndefined();
  });

  test('it should return errors for both E-mail and userName when both are null', async () => {
    const bothNull = Object.assign({}, defaultUser, {
      userName: null,
      email: null,
    });

    const response = await request(app).post('/api/v1/users').send(bothNull);
    const body = response.body;

    expect(Object.keys(body.validationErrors)).toEqual(['userName', 'email']);
  });

  // test('it should return userName cant be null when userName was null', async () => {
  //   const nullUser = Object.assign({}, defaultUser, { userName: null });

  //   const response = await request(app).post('/api/v1/users').send(nullUser);
  //   const body = response.body;

  //   expect(body.validationErrors.userName).toBe('userName cant be null');
  // });

  // test('it should return E-mail cant be null when E-Mail was null', async () => {
  //   const nullEmail = Object.assign({}, defaultUser, { email: null });

  //   const response = await request(app).post('/api/v1/users').send(nullEmail);
  //   const body = response.body;

  //   expect(body.validationErrors.email).toBe('E-mail cant be null');
  // });

  // test('it should return Password cant be null when password is null', async () => {
  //   const nullPassword = Object.assign({}, defaultUser, { password: null });

  //   const response = await request(app)
  //     .post('/api/v1/users')
  //     .send(nullPassword);
  //   const body = response.body;

  //   expect(body.validationErrors.password).toBe('Password cant be null');
  // });

  // implementing dinamic test for similar test  with (test.each(table)(name, fn, timeout))

  // test.each([
  //   ['userName', 'userName cant be null'],
  //   ['email', 'E-mail cant be null'],
  //   ['password', 'Password cant be null'],
  // ])('When %s is null then %s is a response', async (field, expected) => {
  //   const nullField = (defaultUser[field] = null);

  //   const response = await request(app).post('/api/v1/users').send(nullField);
  //   const body = response.body;

  //   expect(body.validationErrors[field]).toBe(expected);
  // });

  // implementing dinamic test with (test.each`table`(name, fn, timeout))

  test.each`
    field         | value                  | expected
    ${'userName'} | ${null}                | ${'userName cant be null'}
    ${'userName'} | ${'t'.repeat(29)}      | ${'This must be between 4 to 27 characters'}
    ${'email'}    | ${null}                | ${'E-mail cant be null'}
    ${'email'}    | ${'mail.com'}          | ${'E-mail is not valid'}
    ${'email'}    | ${'anything.mail.com'} | ${'E-mail is not valid'}
    ${'email'}    | ${'anything@mail'}     | ${'E-mail is not valid'}
    ${'password'} | ${null}                | ${'Password cant be null'}
    ${'password'} | ${'P4ss'}              | ${'password must has at least 6 characters'}
    ${'password'} | ${'ALLUPPERCASE'}      | ${'password must have at leats 1 UPPERCASE, 1 lowercase and one character'}
  `(
    'returns $expected when $field is $value',
    async ({ field, expected, value }) => {
      const user = {
        userName: 'saulo1',
        email: 'saulo1@mail.com',
        password: 'P4ssword',
      };
      user[field] = value;
      console.log(user);
      const response = await request(app).post('/api/v1/users').send(user);
      const body = response.body;
      expect(body.validationErrors[field]).toBe(expected);
    },
  );
});
