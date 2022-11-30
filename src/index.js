import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import session from 'express-session';
import express, { urlencoded } from 'express';
import { MONGO_URI, PORT } from './config.js';
import path from 'path';
import morgan from 'morgan';
import MongoStore from 'connect-mongo';
import indexRoutes from './routes/index.js';
import authenticationRoutes from './routes/authentication.js';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'timeago.js';
import { cloudinaryConfig } from './cloudinary.js';
import flash from 'connect-flash';
import passport from 'passport';

// Initializations
const app = express();
import * as mongodb from './db.js';
import * as auth from './lib/passport.js';

// Settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.ejs');

// Middlewares
app.use(morgan('dev'));
app.use('*', cloudinaryConfig);
app.use(
  session({
    secret: 'doggi doggi',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
  })
);
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  app.locals.format = format;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;

  next();
});

// Routes
app.use(authenticationRoutes);
app.use(indexRoutes);

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Starting Server
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
