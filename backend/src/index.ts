import 'dotenv/config';
import cors from 'cors';
import corsOptions from './config/cors';
import express, { Request, Response, NextFunction } from 'express';
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
import statsRoutes from './routes/statistics/statsRoutes';
import playerActivityRoutes from './routes/statistics/playerActivityRoutes';
import gameRoutes from './routes/game/gameRoutes';
import paymentRoutes from './routes/transaction/shopRoutes';
import nihRoutes from './routes/game/nih-game/nihRoutes';
import openaiRoute from './routes/img-generation/openaiRoute';
import banRoutes from './routes/banRoutes';
import metricsRouter from './routes/metrics';
import playersRouter from './routes/players';
import { initializeModels } from './service/models';

const PORT = process.env.PORT || 3000;
const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

declare module 'express-session' {
  interface SessionData {
    user: { [key: string]: any };
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
app.use('/auth', routes);
app.use('/admin', adminController);
app.use('/invoice', invoiceRoutes);
app.use('/shop', shopRoutes);
app.use('/webhook', webhookRoutes);
app.use('/gameplay', coinRoutes);
app.use('/ai', chatRoutes);
app.use('/statistics/statsRoutes', statsRoutes);
app.use('/statistics/playerActivityRoutes', playerActivityRoutes);
app.use('/game', gameRoutes);
app.use('/payments', paymentRoutes);
app.use('/nih', nihRoutes);
app.use('/openai', openaiRoute);
app.use('/bans', banRoutes);
app.use('/api/bans', banRoutes);
app.use('/api/metrics', metricsRouter);
app.use('/api/games', gameRoutes);
app.use('/api/players', playersRouter);

// Auth routes setup
const authRouter = createAuthRouter(frontendUrl);
app.use('/auth', authRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error Stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = createServer(app);
server.listen(PORT, async () => { 
  try {
    await initializeModels();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${PORT}`);
});

export default app;