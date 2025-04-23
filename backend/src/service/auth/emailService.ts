import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import emailjs from '@emailjs/browser';

// Load environment variables from .env file
dotenv.config();

// Safely retrieve environment variables
const fromName = process.env.EMAIL_FROM_NAME || 'Text Adventure';

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
 * @param toName - The recipient's name.
 * @param verificationLink - The verification link.
 * @returns Email HTML string.
 */
const generateVerificationEmailHtml = (toName: string, verificationLink: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .logo {
            width: 120px;
            height: auto;
            margin: 0 auto 15px;
            display: block;
        }
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        .greeting {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #1F2937;
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #4B5563;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
            color: white !important;
            font-weight: 600;
            font-size: 16px;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }
        .divider {
            height: 1px;
            background-color: #E5E7EB;
            margin: 30px 0;
        }
        .footer {
            padding: 20px 30px 40px;
            text-align: center;
            color: #6B7280;
            font-size: 14px;
            background-color: #ffffff;
        }
        .url-display {
            background-color: #F3F4F6;
            padding: 12px;
            border-radius: 6px;
            word-break: break-all;
            margin: 20px 0;
            font-size: 13px;
            color: #4B5563;
            border: 1px solid #E5E7EB;
        }
        .warning {
            background-color: #FEF2F2;
            color: #DC2626;
            padding: 12px 20px;
            border-radius: 8px;
            margin-top: 25px;
            font-size: 14px;
            border-left: 4px solid #DC2626;
        }
        .warning a {
            color: #DC2626;
            font-weight: 600;
            text-decoration: underline;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-icon {
            display: inline-block;
            margin: 0 8px;
            width: 32px;
            height: 32px;
        }
        .expiry-notice {
            background-color: #FFFBEB;
            padding: 12px 20px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 14px;
            color: #92400E;
            border-left: 4px solid #F59E0B;
        }
        .text-highlight {
            color: #4F46E5;
            font-weight: 600;
        }
        @media only screen and (max-width: 600px) {
            .container {
                border-radius: 0;
            }
            .content {
                padding: 30px 20px;
            }
            .greeting {
                font-size: 20px;
            }
            .message {
                font-size: 15px;
            }
            .button {
                padding: 12px 24px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="display: flex; align-items: center; justify-content: center; width: 100%; text-align: center; margin: 0 auto; margin-bottom: 15px;">
                <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                        <td>
                            <img src="${process.env.LOGO_URL || 'https://text-adventure-six.vercel.app/Logo.png'}" alt="Text Adventure Logo" style="width: 60px; height: auto; vertical-align: middle; display: inline-block;">
                        </td>
                        <td style="padding-left: 10px;">
                            <img src="${process.env.BANNER_URL || 'https://text-adventure-six.vercel.app/Logo SageAI.png'}" alt="Text Adventure Logo Text" style="height: 60px; width: auto; vertical-align: middle; display: inline-block;">
                        </td>
                    </tr>
                </table>
            </div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Verify Your Email</h1>
            <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">One quick step to begin your adventure</p>
        </div>
        
        <div class="content">
            <p class="greeting">Hi ${toName},</p>
            
            <p class="message">Welcome to <span class="text-highlight">Text Adventure</span>! We're excited to have you join our community of storytellers and explorers. To activate your account and begin your journey, please verify your email address.</p>
            
            <div class="button-container">
                <a href="${verificationLink}" class="button">Verify My Email</a>
            </div>
            
            <div class="expiry-notice">
                <strong>⏰ Important:</strong> This verification link will expire in 1 hour for security reasons.
            </div>
            
            <div class="divider"></div>
            
            <p style="margin-bottom: 10px; font-size: 14px; color: #6B7280;">If the button above doesn't work, copy and paste the link below into your browser:</p>
            
            <div class="url-display">
                ${verificationLink}
            </div>
            
            <div class="warning">
                <strong>Security Notice:</strong> If you didn't create this account, please <a href="mailto:support@textadventure.com">contact us</a> immediately.
            </div>
        </div>
        
        <div class="footer">
            <p style="margin-bottom: 15px;">© ${new Date().getFullYear()} Text Adventure. All rights reserved.</p>
            
            <div class="social-links">
                <a href="#" class="social-icon"><img src="https://placehold.co/32x32/6366F1/FFFFFF.png?text=f" alt="Facebook"></a>
                <a href="#" class="social-icon"><img src="https://placehold.co/32x32/6366F1/FFFFFF.png?text=t" alt="Twitter"></a>
                <a href="#" class="social-icon"><img src="https://placehold.co/32x32/6366F1/FFFFFF.png?text=i" alt="Instagram"></a>
            </div>
            
            <p style="margin-top: 20px; font-size: 13px;">
                <a href="#" style="color: #6B7280; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                <a href="#" style="color: #6B7280; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                <a href="#" style="color: #6B7280; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Generates HTML for the reset password email.
 * @param toName - The recipient's name.
 * @param token - The reset password token.
 * @returns Email HTML string.
 */
const generateResetPasswordEmailHtml = (toName: string, token: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .logo {
            width: 120px;
            height: auto;
            margin: 0 auto 15px;
            display: block;
        }
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        .greeting {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #1F2937;
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #4B5563;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
            color: white !important;
            font-weight: 600;
            font-size: 16px;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }
        .divider {
            height: 1px;
            background-color: #E5E7EB;
            margin: 30px 0;
        }
        .footer {
            padding: 20px 30px 40px;
            text-align: center;
            color: #6B7280;
            font-size: 14px;
            background-color: #ffffff;
        }
        .url-display {
            background-color: #F3F4F6;
            padding: 12px;
            border-radius: 6px;
            word-break: break-all;
            margin: 20px 0;
            font-size: 13px;
            color: #4B5563;
            border: 1px solid #E5E7EB;
        }
        .warning {
            background-color: #FEF2F2;
            color: #DC2626;
            padding: 12px 20px;
            border-radius: 8px;
            margin-top: 25px;
            font-size: 14px;
            border-left: 4px solid #DC2626;
        }
        .warning a {
            color: #DC2626;
            font-weight: 600;
            text-decoration: underline;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-icon {
            display: inline-block;
            margin: 0 8px;
            width: 32px;
            height: 32px;
        }
        .security-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 20px;
            display: block;
        }
        @media only screen and (max-width: 600px) {
            .container {
                border-radius: 0;
            }
            .content {
                padding: 30px 20px;
            }
            .greeting {
                font-size: 20px;
            }
            .message {
                font-size: 15px;
            }
            .button {
                padding: 12px 24px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="display: flex; align-items: center; justify-content: center; width: 100%; text-align: center; margin: 0 auto; margin-bottom: 15px;">
                <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                        <td>
                            <img src="${process.env.LOGO_URL || 'https://text-adventure-six.vercel.app/Logo.png'}" alt="Text Adventure Logo" style="width: 60px; height: auto; vertical-align: middle; display: inline-block;">
                        </td>
                        <td style="padding-left: 10px;">
                            <img src="${process.env.BANNER_URL || 'https://text-adventure-six.vercel.app/Logo SageAI.png'}" alt="Text Adventure Logo Text" style="height: 40px; width: auto; vertical-align: middle; display: inline-block;">
                        </td>
                    </tr>
                </table>
            </div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Reset Your Password</h1>
            <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Secure your account in one simple step</p>
        </div>
        
        <div class="content">
            <p class="greeting">Hi ${toName},</p>
            
            <p class="message">We received a request to reset your password for your Text Adventure account. Click the button below to create a new password:</p>
            
            <div class="button-container">
                <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" class="button">Reset My Password</a>
            </div>
            
            <div class="divider"></div>
            
            <p style="margin-bottom: 10px; font-size: 14px; color: #6B7280;">If the button above doesn't work, copy and paste the link below into your browser:</p>
            
            <div class="url-display">
                ${process.env.FRONTEND_URL}/reset-password?token=${token}
            </div>
            
            <div class="warning">
                <strong>Important:</strong> If you didn't request a password reset, please <a href="mailto:support@textadventure.com">contact us</a> immediately to secure your account.
            </div>
        </div>
        
        <div class="footer">
            <p style="margin-bottom: 15px;">© ${new Date().getFullYear()} Text Adventure. All rights reserved.</p>
            
            <div class="social-links">
                <a href="#" class="social-icon"><img src="https://placehold.co/32x32/6366F1/FFFFFF.png?text=f" alt="Facebook"></a>
                <a href="#" class="social-icon"><img src="https://placehold.co/32x32/6366F1/FFFFFF.png?text=t" alt="Twitter"></a>
                <a href="#" class="social-icon"><img src="https://placehold.co/32x32/6366F1/FFFFFF.png?text=i" alt="Instagram"></a>
            </div>
            
            <p style="margin-top: 20px; font-size: 13px;">
                <a href="#" style="color: #6B7280; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                <a href="#" style="color: #6B7280; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                <a href="#" style="color: #6B7280; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Sends a verification email with a unique code.
 * @param to - Recipient's email.
 * @param token - Verification token.
 * @param username - The username of the recipient.
 * @returns Promise<boolean>
 */
export const sendVerificationEmail = async (email: string, token: string, username: string): Promise<boolean> => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  try {
    const mailOptions = {
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Text Adventure Account',
      html: generateVerificationEmailHtml(username, verificationLink),
      headers: {
        'X-Mailer': 'TextAdventureMailer/1.0'
      }
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
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
 * @param username - The username of the recipient.
 * @returns Promise<boolean>
 */
export const sendResetPasswordEmail = async (to: string, token: string, username: string): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset Your Text Adventure Password',
      html: generateResetPasswordEmailHtml(username, token),
      headers: {
        'X-Mailer': 'TextAdventureMailer/1.0'
      }
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return false;
  }
};