const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');
const app = express();
app.use(express.json());
app.use('/', routes);

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test', email: 'test@test.com', password: '123456' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
