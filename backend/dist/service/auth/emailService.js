"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.generateVerificationCode = exports.sendVerificationEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Load environment variables from .env file
dotenv_1.default.config();
// Safely retrieve environment variables
const fromName = process.env.EMAIL_FROM_NAME || 'Text Adventure';
const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const userId = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
// Create reusable transporter object using SMTP transport
const transporter = nodemailer_1.default.createTransport({
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
 * @param toName - The recipient's name.
 * @param verificationLink - The verification link.
 * @returns Email HTML string.
 */
const generateVerificationEmailHtml = (toName, verificationLink) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 20px auto; padding: 30px; background: #f8f9fa; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { width: 150px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto; }
        .banner { width: 100%; height: auto; }
        .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #2563eb; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
            font-weight: bold;
        }
        .footer { margin-top: 30px; color: #6b7280; font-size: 14px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${process.env.BANNER_URL}" alt="Text Adventure Banner" class="banner">
            <img src="${process.env.LOGO_URL}" alt="Text Adventure Logo" class="logo">
            <h2>Welcome to Text Adventure!</h2>
        </div>
        
        <p>Hi ${toName},</p>
        
        <p>Thank you for joining Text Adventure! Click below to verify your email and start your journey:</p>
        
        <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Verify Email Address</a>
        </div>

        <p class="footer">
            This link expires in 1 hour.<br>
            Can't click the button? Copy this URL:<br>
            <code>${verificationLink}</code>
        </p>

        <p style="margin-top: 25px; color: #ef4444;">
            If you didn't create this account, please <a href="mailto:support@textadventure.com">contact us</a> immediately.
        </p>
    </div>
</body>
</html>
`;
/**
 * Generates HTML for the reset password email.
 * @param token - The reset password token.
 * @returns Email HTML string.
 */
const generateResetPasswordEmailHtml = (token) => `
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
 * @param username - The username of the recipient.
 * @returns Promise<boolean>
 */
const sendVerificationEmail = (email, token, username) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    try {
        const mailOptions = {
            from: `"${fromName}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Text Adventure Account',
            html: generateVerificationEmailHtml(username, verificationLink), // Pass user's name
            headers: {
                'X-Mailer': 'TextAdventureMailer/1.0'
            }
        };
        yield transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
/**
 * Generates a verification code.
 * @returns Verification code string.
 */
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
/**
 * Sends a reset password email with a unique token.
 * @param to - Recipient's email.
 * @param token - Reset password token.
 * @returns Promise<boolean>
 */
const sendResetPasswordEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailHtml = generateResetPasswordEmailHtml(token);
        const mailOptions = {
            from: `"${fromName}" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Reset Your Password',
            html: emailHtml,
        };
        yield transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.error('Error sending reset password email:', error);
        return false;
    }
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
//# sourceMappingURL=emailService.js.map