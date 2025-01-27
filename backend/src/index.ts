import 'dotenv/config';
import cors from 'cors';
import corsOptions from './middlware/cors';
import cookieJwtAuth from './middlware/auth';
import express, { Request, Response } from 'express';
import passport from './middlware/passport';
import session from 'express-session';
import database from './service/database';
import Jwt from 'jsonwebtoken';
import routes from './routes/routes';
import adminController from './routes/userCRUDRoutes';
import * as authController from './controllers/authController';
import invoiceRoutes from './routes/invoiceRoutes';
import paymentRoutes from './routes/paymentRoutes';
import User from './model/user';
import chatRoutes from './routes/chatRoutes'; // Import the chatRoutes
import shopRoutes from './routes/shopRoutes';
import webhookRoutes from './routes/webhookRoutes';

const app = express();
const frontendUrl = 'http://localhost:5173';

app.use(cors(corsOptions));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);
app.use('/', adminController);
app.use('/invoice', invoiceRoutes);
app.use('/payments', paymentRoutes);
app.use('/shop', shopRoutes);
app.use('/webhook', webhookRoutes);

// Add the auth routes
app.post('/register', authController.register);
app.post('/login', authController.login);

app.use('/api', chatRoutes);

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

app.get('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('token', { 
    httpOnly: true,
    domain: 'localhost',
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

app.get("/protected", cookieJwtAuth, (req: Request, res: Response) => {
  res.send("This is a protected route");
});

app.get('/auth/:provider',
  (req, res, next) => {
    const { provider } = req.params;
    if (provider === 'google') {
      return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    }
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
    await User.sync({ alter: true });
    console.log('User table has been synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;