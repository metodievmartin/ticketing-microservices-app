import express from 'express';
import 'express-async-errors';
import { json } from 'express';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from '@wigansmedia/common';

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

// - ROUTE HANDLERS -


app.all('*', async () => {
  throw new NotFoundError();
});

// - GLOBAL ERROR HANDLER -
app.use(errorHandler);

export { app };