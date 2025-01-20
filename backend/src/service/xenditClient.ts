import { Xendit } from 'xendit-node';
import dotenv from 'dotenv';

dotenv.config();

const secretApiKey = process.env.XENDIT_SECRET_KEY!;

const xenditClient = new Xendit({
  secretKey: secretApiKey,
  //xenditURL: 'https://api.xendit.co' // Custom base URL
});

export const { Invoice } = xenditClient;