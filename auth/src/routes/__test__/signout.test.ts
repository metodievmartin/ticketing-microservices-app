import request from 'supertest';
import { app } from '../../app';

describe('Sign Out route', () => {
  it('should clear the cookie after sign out', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '12345678'
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signout')
      .send({})
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});