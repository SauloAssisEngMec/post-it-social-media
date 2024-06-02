const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/User');
const sequelize = require('../src/config/database');

const defaultUser = {
  userName: 'saulo',
  email: 'saulo@hotmail.com',
  password: 'fssdujdwdho',
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
    // 1  way
    //request(app).get('/api/v1/users').send(defaultUser).expect(200, done);
    // 2  way
    // request(app)
    //   .post('/api/v1/users')
    //   .send(defaultUser)
    //   .then((response) => {
    //     expect(response.status).toBe(200);
    //     done();
    //   });
    // 3  way
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
});
