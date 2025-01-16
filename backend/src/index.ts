import 'dotenv/config';
import cors from 'cors';
import corsOptions from './middlware/cors';
import cookieJwtAuth from './middlware/auth';
import express, { Request, Response } from 'express';
import passport from './middlware/passport';
import session from 'express-session';
import { error } from 'console';
import database from './service/database';
import Jwt from 'jsonwebtoken';
import routes from './routes/routes';
import adminController from './routes/adminRoutes'; // Import the adminController
import * as authController from './controllers/authController'; // Import the authController
import User from './model/user'; // Import the User model

const app = express();

app.use(cors(corsOptions));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use('/api', adminController); // Use the adminController for /api routes

// Add the auth routes under /api prefix
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

const frontendUrl = 'http://localhost:5173';

app.get('/', (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    if (req.user) {
      // Assuming the user's name is available in the profile
      const user = req.user as any; // Type appropriately based on your Passport strategy
      const username = user.displayName || user.emails[0]?.value; // Fallback to email if displayName is not available
      
      // Generate a token and set it in cookies
      const token = Jwt.sign({ id: user.id, username }, 'test', { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      
      // Redirect to frontend with user info
      res.redirect(`${frontendUrl}/homepage?username=${encodeURIComponent(username)}`);
    } else {
      res.redirect('/?error=authentication_failed');
    }
  }
);

app.get('/auth/logout', (req: Request, res: Response) => {
  // Clear the token cookie
  res.clearCookie('token', { 
    httpOnly: true,
    domain: 'localhost', // Explicitly set domain
    path: '/' 
  });

  // If using sessions, destroy the session
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Failed to destroy session:', err);
      }
    });
  }

  // Instead of redirecting, send a response that the client can handle
  res.json({ 
    message: 'Logged out successfully', 
    redirectUrl: `${frontendUrl}/login` 
  });
});

app.get("/protected", cookieJwtAuth, (req: Request, res: Response) => {
  res.send("This is a protected route");
});

app.get('/auth/:provider',
  (req, res, next) => {
    const { provider } = req.params;
    if (provider === 'google') {
      return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    }
    // Add cases for other providers if needed.
    res.status(400).send("Unsupported provider");
  }
);

app.get('/auth/:provider/callback',
  (req, res, next) => {
    const { provider } = req.params;
    if (provider === 'google') {
      return passport.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
        if (err || !user) {
          return res.redirect('/?error=authentication_failed');
        }
        // Generate and send token or session here.
        const token = Jwt.sign({ id: user.id, email: user.email }, 'test', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
      })(req, res, next);
    }
    res.status(400).send("Unsupported provider");
  }
);

app.listen(3000, async () => { 
  try {
    await database.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    // Synchronize the User model with the database
    await User.sync({ alter: true });
    console.log('User table has been synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log('Server is running on port 3000');
});

export default app;