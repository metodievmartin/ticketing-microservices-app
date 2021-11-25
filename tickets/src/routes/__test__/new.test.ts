import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

describe('Create Ticket route', () => {
  it('should have a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it('should only be accessed if the user is signed in', async () => {
    await request(app)
      .post('/api/tickets')
      .send({})
      .expect(401);
  });

  it('should return a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', getAuthCookie())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('should return an error if invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', getAuthCookie())
      .send({
        title: '',
        price: 10
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', getAuthCookie())
      .send({
        price: 10
      })
      .expect(400);
  });

  it('should return an error if invalid price is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', getAuthCookie())
      .send({
        title: 'Title',
        price: -1
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', getAuthCookie())
      .send({
        title: 'Title',
      })
      .expect(400);
  });

  it('should create a ticket with valid parameters', async () => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    const title = 'Test ticket';
    const price = 100;

    await request(app)
      .post('/api/tickets')
      .set('Cookie', getAuthCookie())
      .send({
        title,
        price
      })
      .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual(price);
  });
});