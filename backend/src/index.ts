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
import adminController from './routes/userCRUDRoutes'; // Import the adminController
import * as authController from './controllers/authController'; // Import the authController
import User from './model/user'; // Import the User model
import chatRoutes from './routes/chatRoutes'; // Import the chatRoutes

const app = express();

app.use(cors(corsOptions));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);
app.use('/', adminController); 
app.use('/api', chatRoutes); // Add the chat routes

app.listen(process.env.PORT, async () => { 
  try {
    await database.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    // Synchronize the User model with the database
    await User.sync({ alter: true });
    console.log('User table has been synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;