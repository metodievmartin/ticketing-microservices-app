import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

describe('Create Ticket route', () => {
  it('should return 400 if ticket id is not valid', async () => {
    await request(app)
      .get('/api/tickets/sdjfsjdsdgv')
      .send()
      .expect(400);
  });

  it('should return 404 if ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .get(`/api/tickets/${id}`)
      .send()
      .expect(404);
  });

  it('should return the ticket if request is valid', async () => {
    const title = 'Test Ticket';
    const price = 100;

    const createTicketRes = await request(app)
      .post('/api/tickets')
      .set('Cookie', getAuthCookie())
      .send({
        title,
        price
      })
      .expect(201);

    const getTicketRes = await request(app)
      .get(`/api/tickets/${createTicketRes.body.id}`)
      .send()
      .expect(200);

    expect(getTicketRes.body.title).toEqual(title);
    expect(getTicketRes.body.price).toEqual(price);
  });
});