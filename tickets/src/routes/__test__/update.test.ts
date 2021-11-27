import request from 'supertest';

import { app } from '../../app';
import mongoose from 'mongoose';

describe('Update Ticket route', () => {
  it('should return a 404 if the provided Id does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', getAuthCookie())
      .send({
        title: 'Test',
        price: 100
      })
      .expect(404);
  });

  it('should return a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: 'Test',
        price: 100
      })
      .expect(401);
  });

  it('should return a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', getAuthCookie())
      .send({
        title: 'Test',
        price: 100
      });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', getAuthCookie())
      .send({
        title: 'TestUpdate',
        price: 100
      })
      .expect(401);
  });

  it('should return a 400 if the user provides an invalid title or price', async () => {
    const cookie = getAuthCookie();

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Test',
        price: 100
      });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 100
      })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'Update',
        price: -100
      })
      .expect(400);
  });

  it('should update the ticket provided valid inputs', async () => {
    const cookie = getAuthCookie();

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Test',
        price: 100
      });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'Updated',
        price: 200
      })
      .expect(200);

    const updatedTicket = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send();

    expect(updatedTicket.body.title).toEqual('Updated');
    expect(updatedTicket.body.price).toEqual(200);
  });
});