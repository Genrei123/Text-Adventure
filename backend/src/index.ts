import 'dotenv/config';
import cors from 'cors';
import corsOptions from './middlware/cors';
import express, { Request, Response, Router } from 'express';
import session from 'express-session';
import database from './service/database';
import User from './model/user';
import routes from './routes/routes';
import adminController from './routes/userCRUDRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import paymentRoutes from './routes/paymentRoutes';
import shopRoutes from './routes/shopRoutes';
import webhookRoutes from './routes/webhookRoutes';
import authRoutes from './routes/authRoutes'; // Import the authRoutes
import * as authController from './controllers/authController';
import User from './model/user';
// import shopRoutes from './routes/Xendit Routes/shopRoutes';
// import webhookRoutes from './routes/Xendit Routes/webhookRoutes';
import chatRoutes from './routes/chatRoutes'; // Import the chatRoutes


const app = express();
const router = Router();
const frontendUrl = 'http://localhost:5173';

app.use(cors(corsOptions));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);
app.use('/', adminController);
app.use('/invoice', invoiceRoutes);
app.use('/payments', paymentRoutes);
app.use('/shop', shopRoutes);
app.use('/webhook', webhookRoutes);
authRoutes(router, frontendUrl); // Use the authRoutes with router and frontendUrl
app.use('/', router);

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