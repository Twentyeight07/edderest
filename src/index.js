import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import express, { urlencoded } from 'express';
import { PORT } from './config.js';
import path from 'path';
import morgan from 'morgan';
import indexRoutes from './routes/index.js';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'timeago.js';
import { cloudinaryConfig } from './cloudinary.js';

// Initializations
const app = express();
import * as mongodb from './db.js';

// Settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.ejs');

// Middlewares
app.use(morgan('dev'));
app.use('*', cloudinaryConfig);
app.use(urlencoded({ extended: false }));
app.use(express.json());
// const storage = multer.diskStorage({
//   destination: path.join(__dirname, 'public/img/uploads'),
//   filename: (req, file, cb, filename) => {
//     cb(null, uuidv4() + path.extname(file.originalname));
//   },
// });
// app.use(
//   multer({
//     storage: storage,
//   }).single('image')
// );

// Global Variables
app.use((req, res, next) => {
  app.locals.format = format;

  next();
});

// Routes
app.use(indexRoutes);

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Starting Server
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
