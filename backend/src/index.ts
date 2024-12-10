import cors from 'cors';
import corsOptions from './middlware/cors';
import cookieJwtAuth from './middlware/auth';
import express, { Request, Response } from 'express';
import passport from './middlware/passport';
import session from 'express-session';
import { error } from 'console';
import database from './service/database';

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.get("/protected", cookieJwtAuth, (req: Request, res: Response) => {
  res.send("This is a protected route");
});



app.listen(3000, () => {
  console.log(database.getDatabaseName());
});