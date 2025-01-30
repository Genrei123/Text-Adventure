import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables from .env file
dotenv.config();

// Safely retrieve environment variables
const fromName = 'Text Adventure';

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
 * @param code - Verification code.
 * @returns Promise<boolean>
 */
export const sendVerificationEmail = async (to: string, code: string): Promise<boolean> => {
  try {
    const emailHtml = generateVerificationEmailHtml(code);

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
