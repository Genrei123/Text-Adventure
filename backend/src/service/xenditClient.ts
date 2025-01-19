import dotenv from 'dotenv';

dotenv.config();

const secretApiKey = process.env.XENDIT_SECRET_KEY!;
const base64EncodedKey = Buffer.from(`${secretApiKey}:`).toString('base64');


export const xenditHeaders = {
  'Authorization': `Basic ${base64EncodedKey}`,
  'Content-Type': 'application/json'
};