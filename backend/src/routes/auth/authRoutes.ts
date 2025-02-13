import { Router, Request, Response } from 'express';
import passport from '../../middlware/auth/google/passport';
import Jwt from 'jsonwebtoken';
import cookieJwtAuth from '../../middlware/auth/auth';
import { forgotPassword, resetPassword, validateResetToken, verifyEmail } from '../../controllers/auth/authController';

// Create a function that returns the configured router
const createAuthRouter = (frontendUrl: string) => {
  const router = Router();

  router.post('/forgot-password', forgotPassword);
  router.post('/validate-reset-token', validateResetToken);
  router.post('/reset-password', resetPassword);

  router.get('/', (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req: Request, res: Response) => {
      if (req.user) {
        const user = req.user as any;
        const username = user.displayName || user.emails[0]?.value;
        const token = Jwt.sign({ id: user.id, username }, 'test', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect(`${frontendUrl}/homepage?username=${encodeURIComponent(username)}`);
      } else {
        res.redirect('/?error=authentication_failed');
      }
    }
  );

  router.get('/auth/logout', (req: Request, res: Response) => {
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

  router.get('/auth/:provider',
    (req, res, next) => {
      const { provider } = req.params;
      if (provider === 'google') {
        return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
      }
      res.status(400).send("Unsupported provider");
    }
  );

  router.get('/auth/:provider/callback',
    (req, res, next) => {
      const { provider } = req.params;
      if (provider === 'google') {
        return passport.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
          if (err || !user) {
            return res.redirect('/?error=authentication_failed');
          }
          const token = Jwt.sign({ id: user.id, email: user.email }, 'test', { expiresIn: '1h' });
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