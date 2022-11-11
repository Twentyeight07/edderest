import { CLOUD_NAME, API_KEY, API_SECRET } from './config.js';
import { config, uploader } from 'cloudinary';

const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
  next();
};

export { cloudinaryConfig, uploader };
