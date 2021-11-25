import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@wigansmedia/common';
import { User } from '../models/user';
import { Password } from '../utils/password';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid email or password');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid email or password');
    }

    // Generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
      },
      process.env.JWT_KEY!
    );

    // Store JWT on session object
    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser);
  });

export { router as signinRouter };