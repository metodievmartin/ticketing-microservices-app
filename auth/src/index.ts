import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import { json } from 'express';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

// Make sure express is aware we are behind nginx-ingress proxy
app.set('trust proxy', true);

// - GLOBAL MIDDLEWARE -
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
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

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY env var must be defined!');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Auth service listening on port 3000...');
  });
};

start();