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
      try {
        if (req.user) {
          const req_user = req.user as any;
          // Use the email from the user object or fallback to the emails array
          const emailFromProvider = req_user.email || (req_user.emails && req_user.emails.length > 0 ? req_user.emails[0].value : null);
          if (!emailFromProvider) {
            throw new Error("No email provided by Google account");
          }
          const username = req_user.displayName || emailFromProvider;
          // Prepare default avatar URL using DiceBear API
          const defaultAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(username)}`;
          
          console.log('Checking if user exists:', emailFromProvider);
          const userExists = await User.findOne({ where: { email: emailFromProvider }});
          if (userExists) {
            console.log('User exists:', userExists);
            // For login, if no avatar is set, update with default avatar
            if (!userExists.image_url) {
              await userExists.update({ image_url: defaultAvatar });
            }
          } else {
            console.log('Creating new user:', emailFromProvider);
            const newUser = await User.create({
              email: emailFromProvider,
              username: username,
              private: false,
              model: 'gpt-3.5',
              password: '',
              admin: false,
              emailVerified: true,
              image_url: defaultAvatar,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            console.log('New user created:', newUser);
          }
    
          // Sign JWT token (preserving existing validations)
          const token = Jwt.sign({ id: req_user.id, username, email: emailFromProvider }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
          // Set token as httpOnly cookie to ensure it is passed in subsequent requests (fixing jwt malformed errors)
          res.cookie('token', token, { httpOnly: true });
          res.redirect(`${frontendUrl}/home?token=${token}`);
        } else {
          res.redirect('/?error=authentication_failed');
        }
      } catch (error) {
        console.error('Error in Google auth callback:', error);
        res.redirect(`${frontendUrl}/forbidden`);
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