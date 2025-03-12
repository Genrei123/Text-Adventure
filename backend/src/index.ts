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
import sessionRoutes from './routes/statistics/sessionRoutes';
import nihRoutes from './routes/game/nih-game/nihRoutes';
import openaiRoute from './routes/img-generation/openaiRoute'; // Image generation
import comfyuiRoute from './routes/img-generation/comfyuiRoute';
import banRoutes from './routes/banRoutes';
import metricsRouter from './routes/metrics';
import playersRouter from './routes/players';
import imageRoutes from './routes/image/imageRoutes';
import jwtAuth from './middlware/auth/auth';
import cookieParser from 'cookie-parser';
import path from 'path';
import seedTokenPackages from './service/transaction/tokenPackageSeeder';
import { initializeModels } from './service/models';

const PORT = process.env.PORT || 3000;
const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

declare module 'express-session' {
  interface SessionData {
    userId: number;
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
app.use('/statistics/statsRoutes', statsRoutes);
app.use('/statistics/playerActivityRoutes', playerActivityRoutes);
app.use('/game', gameRoutes);
app.use('/payments', paymentRoutes);
app.use("/sessions", sessionRoutes);
app.use('/nih', nihRoutes);
app.use('/openai', openaiRoute); // Dall-E image generation 
app.use('/comfyui', comfyuiRoute); // ComfyUI - image generation for SDXL, SD3, etc. (P.S. YOU CAN'T RUN THIS WITHOUT MY PRECIOUS RTX 4060 Ti WAHAHAHAHA! (I meant if my PC is off.))
app.use('/bans', banRoutes);
app.use('/api/bans', banRoutes);
app.use('/api/metrics', metricsRouter);
app.use('/api/games', gameRoutes);
app.use('/api/players', playersRouter);
app.use('/image', jwtAuth, imageRoutes);
app.use('/images', express.static('public/images'));

// OAuth routes setup
const authRouter = createAuthRouter(frontendUrl);
app.use('/oauth', authRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global Error Handler:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Server Error' 
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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

const outputPath = path.join(__dirname, '../../../../Stable Diffusion/ComfyUI_windows_portable/ComfyUI/output');
app.use('/images', express.static(outputPath));

export default app;