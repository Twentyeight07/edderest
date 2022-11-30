import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  fullname: { type: String },
  username: { type: String },
  hash: { type: String },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image',
    },
  ],
  admin: { type: Boolean, default: false },
});

export const User = model('User', userSchema);
