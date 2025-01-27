import dotenv from 'dotenv';
import emailjs from '@emailjs/browser';

// Load environment variables from .env file
dotenv.config();

// Safely retrieve environment variables with fallback
const serviceId = process.env.EMAILJS_SERVICE_ID || '';
const templateId = process.env.EMAILJS_TEMPLATE_ID || '';
const userId = process.env.EMAILJS_PUBLIC_KEY || '';
const fromName = 'Text Adventure';

export const sendVerificationEmail = async (
  toEmail: string,
  verificationCode: string
): Promise<boolean> => {
  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: toEmail,
        verification_code: verificationCode,
        from_name: fromName
      },
      userId
    );
    return response.status === 200;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};