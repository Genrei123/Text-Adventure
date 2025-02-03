import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import emailjs from '@emailjs/browser';

// Load environment variables from .env file
dotenv.config();

// Safely retrieve environment variables
const fromName = 'Text Adventure';

const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID!;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID!;
const userId = process.env.REACT_APP_EMAILJS_PUBLIC_KEY!;

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // This should be an App Password, not your regular password
  },
});

/**
 * Generates HTML for the verification email.
 * @param code - The verification code.
 * @returns Email HTML string.
 */
const generateVerificationEmailHtml = (code: string): string => `
  <div style="font-family: Arial, sans-serif; text-align: center;">
    <h2>Verify Your Email</h2>
    <p>Your verification code is:</p>
    <h3 style="color: #007bff;">${code}</h3>
    <p>Please enter this code in the application to complete your registration.</p>
  </div>
`;

/**
 * Generates HTML for the reset password email.
 * @param token - The reset password token.
 * @returns Email HTML string.
 */
const generateResetPasswordEmailHtml = (token: string): string => `
  <div style="font-family: Arial, sans-serif; text-align: center;">
    <h2>Reset Your Password</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" 
       style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
       Reset Password
    </a>
    <p>If you didn't request this, you can safely ignore this email.</p>
  </div>
`;

/**
 * Sends a verification email with a unique code.
 * @param to - Recipient's email.
 * @param token - Verification token.
 * @returns Promise<boolean>
 */
export const sendVerificationEmail = async (to: string, token: string): Promise<boolean> => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const emailHtml = `
    <html>
      <body>
        <p>Hi there,</p>
        <p>Thank you for signing up on our website! We're excited to have you on board.</p>
        <p>Please click the link below to verify your email address:</p>
        <p><a href="${verificationLink}">Verify email</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you're having trouble clicking the button, copy and paste the URL below into your browser:</p>
        <p>${verificationLink}</p>
        <p>If you didn't create this account, please let us know by replying to this email.</p>
        <p>Best regards,</p>
        <p>The Website Team</p>
      </body>
    </html>
  `;

  try {
    const mailOptions = {
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

/**
 * Generates a verification code.
 * @returns Verification code string.
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends a reset password email with a unique token.
 * @param to - Recipient's email.
 * @param token - Reset password token.
 * @returns Promise<boolean>
 */
export const sendResetPasswordEmail = async (to: string, token: string): Promise<boolean> => {
  try {
    const emailHtml = generateResetPasswordEmailHtml(token);

    const mailOptions = {
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset Your Password',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return false;
  }
};
