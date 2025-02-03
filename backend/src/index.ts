import 'dotenv/config';
import cors from 'cors';
import corsOptions from './middlware/cors';
import express, { Request, Response, Router } from 'express';
import session from 'express-session';
import database from './service/database';
import routes from './routes/routes';
import adminController from './routes/userCRUDRoutes';
import invoiceRoutes from './routes/Xendit Routes/invoiceRoutes';
import shopRoutes from './routes/Xendit Routes/shopRoutes';
import webhookRoutes from './routes/Xendit Routes/webhookRoutes';
import createAuthRouter from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import User from './model/user';
import coinRoutes from './routes/Game Routes/coinRoutes';

const app = express();
const frontendUrl = 'http://localhost:5173';

// Middleware setup
app.use(cors(corsOptions));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route setup
app.use('/', routes);
app.use('/', adminController);
app.use('/invoice', invoiceRoutes); // Invoice routes setup
app.use('/shop', shopRoutes); // Shop routes setup
app.use('/webhook', webhookRoutes); // Webhook routes setup
app.use('/gameplay', coinRoutes); // Coin routes setup

// Auth routes setup - using the new createAuthRouter function
const authRouter = createAuthRouter(frontendUrl);
app.use('/api', authRouter);

//app.use('/api', chatRoutes);

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