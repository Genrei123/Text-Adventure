import 'dotenv/config';
import cors from 'cors';
import corsOptions from './config/cors';
import express from 'express';
import session from 'express-session';
import database from './service/database';
import routes from './routes/auth/routes';
import adminController from './routes/user/userCRUDRoutes';
import invoiceRoutes from './routes/transaction/invoiceRoutes';
import shopRoutes from './routes/transaction/shopRoutes';
import webhookRoutes from './routes/transaction/webhookRoutes';
import createAuthRouter from './routes/auth/authRoutes';
import chatRoutes from './routes/chat/chatRoutes';
import User from './model/user/user';
import coinRoutes from './routes/coins/coinRoutes';
import { createServer } from './websocket/socket';
import statsRoutes from './routes/statistics/statsRoutes'; // Import the new stats route
import gameRoutes from './routes/game/gameRoutes';
import { initializeModels } from './service/models';
import paymentRoutes from './routes/transaction/shopRoutes';
import sessionRoutes from './routes/statistics/sessionRoutes'; // Import the session routes
import nihRoutes from './routes/game/nih-game/nihRoutes';
import openaiRoute from './routes/img-generation/openaiRoute'; // Image generation
import banRoutes from './routes/banRoutes';
import imageRoutes from './routes/image/imageRoutes';
import jwtAuth from './middlware/auth/auth';
import cookieParser from 'cookie-parser';
import seedTokenPackages from './service/transaction/tokenPackageSeeder';


const PORT = process.env.PORT || 3000;
const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    // Add other session properties you need
  }
}

seedTokenPackages().then(() => console.log('Token packages seeded'));

// Middleware setup
app.use(cors(corsOptions));
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'your_secret_key', 
  resave: false, 
  saveUninitialized: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route setup
app.use('/auth', routes);
app.use('/admin', adminController);
app.use('/invoice', invoiceRoutes);
app.use('/shop', shopRoutes);
app.use('/webhook', webhookRoutes);
app.use('/gameplay', coinRoutes);
app.use('/ai', chatRoutes);
app.use('/statistics/statsRoutes', statsRoutes); // Use the new stats route
app.use('/game', gameRoutes);
app.use('/payments', paymentRoutes);
app.use("/sessions", sessionRoutes); // Add the session routes
app.use('/nih', nihRoutes);
app.use('/openai', openaiRoute); // Image generation
app.use('/bans', banRoutes);
app.use('/api/bans', banRoutes);  // Fixes 404 for /api/bans
app.use('/image', jwtAuth, imageRoutes);


app.use('/images', express.static('public/images'));


// Auth routes setup
const authRouter = createAuthRouter(frontendUrl);
app.use('/auth', authRouter);

const server = createServer(app);
server.listen(PORT, async () => { 
  try {
    //await database.authenticate();
    await initializeModels();
    console.log('Connection to the database has been established successfully.');
    await User.sync({ alter: true });
    console.log('User table has been synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${PORT}`);
});

export default app;