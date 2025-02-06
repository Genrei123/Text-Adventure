import { CorsOptions } from 'cors';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173", "https://text-adventure-six.vercel.app/", frontendUrl], // Specify the frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify only the methods you want to allow
  credentials: true, // Allow cookies to be sent with requests
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
};

export default corsOptions;
