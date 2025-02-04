import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:5173",
    "https://text-adventure-six.vercel.app/",
    "https://orange-space-engine-66r5v9667p5h46qr-8080.app.github.dev" // Add your Codespace URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify only the methods you want to allow
  credentials: true, // Allow cookies to be sent with requests
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
};

export default corsOptions;