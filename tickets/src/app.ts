import express from 'express';
import 'express-async-errors';
import { json } from 'express';
import cookieSession from 'cookie-session';

import { currentUser, errorHandler, NotFoundError } from '@wigansmedia/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';

const app = express();

// Make sure express is aware we are behind nginx-ingress proxy
app.set('trust proxy', true);

// - GLOBAL MIDDLEWARE --
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);

// - ROUTE HANDLERS -
app.use(createTicketRouter);
app.use(showTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

// - GLOBAL ERROR HANDLER -
app.use(errorHandler);

export { app };