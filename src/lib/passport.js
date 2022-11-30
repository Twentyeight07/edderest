import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/Users.js';
import { matchPassword } from './helpers.js';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
    },
    async (username, password, done) => {
      // Validate username
      const user = await User.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: 'Wrong username or password :( ' });
      }

      // Validate password
      const correctPassword = await matchPassword(password, user.hash);

      if (!correctPassword) {
        return done(null, false, { message: 'Wrong username or password :( ' });
      }

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
