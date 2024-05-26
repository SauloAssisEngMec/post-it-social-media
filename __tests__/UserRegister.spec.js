const request = require('supertest');
const app = require('../src/app');

const defaultUser = {
  name: 'saulo',
  email: 'saulo@hotmail.com',
  password: 'fssdujdwdho',
};

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
});
