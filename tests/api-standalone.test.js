// ساختن یک mock پیشرفته با jest.fn()
const mockGet = jest.fn()
  .mockReturnValueOnce(undefined)  // بار اول: کاربر وجود ندارد (ثبت‌نام)
  .mockReturnValueOnce({ id: 1, username: 'newuser', role: 'user', password: 'hashed' }); // لاگین

const mockRun = jest.fn(() => ({ lastInsertRowid: 1 }));

jest.mock('better-sqlite3', () => {
  const mockDb = {
    prepare: () => ({
      get: mockGet,
      run: mockRun,
      all: () => []
    }),
    exec: () => {},
    pragma: () => {}
  };
  return jest.fn(() => mockDb);
});

jest.mock('bcryptjs', () => ({
  hashSync: () => 'hashed',
  compareSync: () => true
}));

const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');
const app = express();
app.use(express.json());
app.use('/', routes);

describe('Auth API (mocked DB)', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'newuser', email: 'e@e.com', password: '12345678' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'newuser', password: '12345678' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
