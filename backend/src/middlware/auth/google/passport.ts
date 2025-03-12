import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../../../model/user/user'; // Ensure you import your User model

dotenv.config();

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientID || !googleClientSecret) {
  throw new Error('Missing Google OAuth credentials in environment variables');
}

passport.use(new GoogleStrategy({
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: "/oauth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        throw new Error("No email found in Google profile");
      }
      const username = profile.displayName || email || 'User';
      // Set default DiceBear avatar URL using the username as seed
      const defaultAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(username)}`;
      
      // Find existing user or create a new one while setting image_url to defaultAvatar
      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          username,
          email,
          password: '', // No password for Google OAuth
          private: false,
          model: 'gpt-3.5',
          admin: false,
          emailVerified: true,
          image_url: defaultAvatar,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;