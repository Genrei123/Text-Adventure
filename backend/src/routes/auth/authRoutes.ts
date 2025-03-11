import { Router, Request, Response, NextFunction } from 'express';
import passport from '../../middlware/auth/google/passport';
import Jwt from 'jsonwebtoken';
import cookieJwtAuth from '../../middlware/auth/auth';
import { forgotPassword, resetPassword, validateResetToken, verifyEmail, checkUsername, checkEmail } from '../../controllers/auth/authController';
import User from '../../model/user/user';

// Create a function that returns the configured router
const createAuthRouter = (frontendUrl: string) => {
  const router = Router();

  router.post('/forgot-password', forgotPassword);
  router.post('/validate-reset-token', validateResetToken);
  router.post('/reset-password', resetPassword);
  router.post('/check-username', checkUsername);
  router.post('/check-email', checkEmail);

  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req: Request, res: Response) => {
      if (req.user) {
        const req_user = req.user as any;
        const username = req_user.displayName || req_user.emails[0]?.value;
        // Check if the user is in the database already
        // If not, create a new user
        // If yes, block the user from creating a new account

        try {
          console.log('Checking if user exists:', req_user.emails[0]?.value);
          const userExists = await User.findOne({ where: {email: req_user.emails[0]?.value}})
          if (userExists) {
            console.log('User exists:', userExists);
          } else {
            console.log('Creating new user:', req_user.emails[0]?.value);
            const newUser = await User.create({
              email: req_user.emails[0]?.value,
              username: username,
              private: false,
              model: 'gpt-3.5',
              password: '',
              admin: false,
              emailVerified: true,
              createdAt: new Date(),
              updatedAt: new Date()
            });

            console.log('New user created:', newUser);
          }
        } catch (error) {
          console.error('Error creating user:', error);
          res.redirect(`${frontendUrl}/forbidden`);
          return;
        }
        const token = Jwt.sign({ id: req_user.id, username, email: req_user.emails[0]?.value }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        //res.redirect(`${frontendUrl}/?token=${token}`);
        res.redirect(`${frontendUrl}/home?token=${token}`);
      } else {
        res.redirect('/?error=authentication_failed');
      }
    }
  );

  router.get('/logout', (req: Request, res: Response) => {
    res.clearCookie('token', { 
      httpOnly: true,
      domain: process.env.DOMAIN,
      path: '/' 
    });

    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Failed to destroy session:', err);
        }
      });
    }

    res.json({ 
      message: 'Logged out successfully', 
      redirectUrl: `${frontendUrl}/login` 
    });
  });

  router.get("/protected", cookieJwtAuth, (req: Request, res: Response) => {
    res.send("This is a protected route");
  });

  router.get('/:provider',
    (req, res, next) => {
      const { provider } = req.params;
      if (provider === 'google') {
        return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
      }
      res.status(400).send("Unsupported provider");
    }
  );

  router.get('/:provider/callback',
    (req: Request, res: Response, next: NextFunction) => {
      const { provider } = req.params;
      if (provider === 'google') {
        return passport.authenticate('google', { failureRedirect: '/' }, (err: any, user: any, info: any) => {
          if (err || !user) {
            return res.redirect('/?error=authentication_failed');
          }
          const token = Jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
          res.cookie('token', token, { httpOnly: true });
          res.redirect('/');
        })(req, res, next);
      }
      res.status(400).send("Unsupported provider");
    }
  );

  router.get('/verify-email/:token', verifyEmail);

  // ... other routes

  return router;
};

export default createAuthRouter;