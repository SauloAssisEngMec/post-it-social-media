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
  test('it should return status code 200 when singup request is valid', (done) => {
    //request(app).get('/api/v1/users').send(defaultUser).expect(200, done);
    request(app)
      .post('/api/v1/users')
      .send(defaultUser)
      .then((response) => {
        expect(response.status).toBe(200);
        done();
      });
  });

  test('it should return success message if singup request is valid', (done) => {
    //request(app).get('/api/v1/users').send(defaultUser).expect(200, done);
    request(app)
      .post('/api/v1/users')
      .send(defaultUser)
      .then((response) => {
        expect(response.body.message).toBe('success message');
        done();
      });
  });

  test('it should save user to database', (done) => {
    //request(app).get('/api/v1/users').send(defaultUser).expect(200, done);
    request(app)
      .post('/api/v1/users')
      .send(defaultUser)
      .then(() => {
        User.findAll().then((userList) => {
          expect(userList.length).toBe(1);
          done();
        });
      });
  });

  test('it should save user to database and check if email and name is correct', (done) => {
    //request(app).get('/api/v1/users').send(defaultUser).expect(200, done);
    request(app)
      .post('/api/v1/users')
      .send(defaultUser)
      .then(() => {
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.userName).toBe(defaultUser.userName);
          expect(savedUser.email).toBe(defaultUser.email);
          done();
        });
      });
  });

  test('it should hash password', (done) => {
    request(app)
      .post('/api/v1/users')
      .send(defaultUser)
      .then(() => {
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          //expect(savedUser.password).toBe(defaultUser.password); // confere se sao iguais de fato ou se a diferença n foi um erro
          expect(savedUser.password).not.toBe(defaultUser.password);
          done();
        });
      });
  });
});
