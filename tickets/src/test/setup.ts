import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'test-secret-key';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

declare global {
  var getAuthCookie: () => string[];
}

global.getAuthCookie = () => {
  // Create payload object
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  // Encode the stringify session as base64
  const base64session = Buffer.from(sessionJSON).toString('base64');

  return [`express:sess=${base64session}`];
}