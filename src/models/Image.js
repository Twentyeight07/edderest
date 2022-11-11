import { Schema, model } from 'mongoose';

const imageSchema = new Schema({
  title: { type: String },
  description: { type: String },
  filename: { type: String },
  path: { type: String },
  originalname: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  created_at: { type: Date, default: Date.now() },
  cloudinary_id: { type: String },
});

export const Image = model('Image', imageSchema);
