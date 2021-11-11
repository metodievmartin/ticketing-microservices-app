import mongoose from 'mongoose';
import { Password } from '../utils/password';

// The additional interfaces and syntax here is to make mongoose and typescript work together

// An interface that describes the properties
// that are required to create a new User
interface UserAttr {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttr): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: { // Basically modifies the object that is being returned (usually as response)
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  next();
});

// Creating a new user via this static function so that we can leverage typechecking
// which is otherwise not available in mongoose by creating a user by calling 'new User()';
userSchema.statics.build = (attributes: UserAttr) => {
  return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };