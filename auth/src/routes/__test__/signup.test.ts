import request from 'supertest';
import { app } from '../../app';

describe('Sign Up route', () => {
  it('should return a 201 on successful signup', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(201);
  });

  it('should return a 400 with invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@testcom',
        password: '12345678'
      })
      .expect(400);
  });

  it('should return a 400 with invalid password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '1'
      })
      .expect(400);
  });

  it('should return a 400 with empty input', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({})
      .expect(400);
  });

  it('disallows duplicate emails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(201);

    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(400);
  });

  it('should set a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
