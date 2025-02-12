import 'dotenv/config';
import cors from 'cors';
import corsOptions from './middlware/cors';
import express, { Request, Response } from 'express';
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
import { createServer } from './websocket/socket';

const PORT = process.env.PORT || 3000;
const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    // Add other session properties you need
  }
}

// Middleware setup
app.use(cors(corsOptions));
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'your_secret_key', 
  resave: false, 
  saveUninitialized: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route setup
app.use('/', routes);
app.use('/', adminController);
app.use('/invoice', invoiceRoutes);
app.use('/shop', shopRoutes);
app.use('/webhook', webhookRoutes);
app.use('/gameplay', coinRoutes);
app.use('/ai', chatRoutes);

// Auth routes setup
const authRouter = createAuthRouter(frontendUrl);
app.use('/api', authRouter);

const server = createServer(app);

server.listen(PORT, async () => { 
  try {
    await database.authenticate();
    console.log('Connection to the database has been established successfully.');
    await User.sync({ alter: true });
    console.log('User table has been synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${PORT}`);
});

export default app;