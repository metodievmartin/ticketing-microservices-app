import request from 'supertest';
import { app } from '../../app';

describe('Sign In route', () => {
  it('should fail when a email that does not exist is supplied', async () => {
    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(400);
  });

  it('should fail when no input is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(201);

    return request(app)
      .post('/api/users/signin')
      .send({})
      .expect(400);
  });

  it('should fail when an incorrect password is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(201);

    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: '123456'
      })
      .expect(400);
  });

  it('should fail when an incorrect email is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(201);

    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test1@test.com',
        password: '12345678'
      })
      .expect(400);
  });

  it('should respond with a cookie when given valid credentials', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
