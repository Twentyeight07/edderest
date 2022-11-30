import { Router } from 'express';
const router = Router();

import { User } from '../models/Users.js';
import passport from 'passport';
import { encryptPassword } from '../lib/helpers.js';

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const user = new User();
  const { fullname, username, password, confirm_password } = req.body;

  try {
    const errors = [];
    //Validations
    if (password != confirm_password) {
      req.flash('error_msg', 'Password do not match :( ');
      return res.redirect('/signup');
      // errors.push({ text: 'Password do not match :(' });
    }

    if (password.length < 4) {
      req.flash('error_msg', 'Password must be at least 4 characters');
      return res.redirect('/signup');
      // errors.push({ text: 'Password must be at least 4 characters' });
    }

    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      req.flash('error_msg', 'The username is already in use :( ');
      res.redirect('/signup');
    }

    //Database registration
    user.fullname = fullname;
    user.username = username;
    user.hash = await encryptPassword(password);

    await user.save();

    req.flash('success_msg', 'User registered successfully :) ');
    res.redirect('/signin');
    // console.log(req.body);
  } catch (err) {
    console.log(err);
  }
});

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true,
  })
);

router.get('/logout', async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'You have logout successfully');
    res.redirect('/signin');
  });
});

export default router;
