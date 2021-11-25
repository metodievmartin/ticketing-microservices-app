import express from 'express';
import 'express-async-errors';
import { json } from 'express';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
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
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

// - GLOBAL ERROR HANDLER -
app.use(errorHandler);

export { app };