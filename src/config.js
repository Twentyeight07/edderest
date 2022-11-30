import { config } from 'dotenv';

config();

export const PORT = process.env.PORT;
export const MONGO_DB_URI = process.env.MONGO_DB_URI;
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
export const MONGO_URI = process.env.MONGO_DB_URI;
