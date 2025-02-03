import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/user";
import jwt from "jsonwebtoken";
import { ValidationError, Op } from "sequelize";
import { RegisterRequestBody } from "../interfaces/RegisterRequestBody";
import { validatePassword } from "../utils/passwordValidator";
import { sendVerificationEmail, sendResetPasswordEmail } from '../service/emailService';
import crypto from 'crypto';

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
    const { username, email, password, private: isPrivate, model, admin } = req.body;
    try {
        // Validate password
        if (!validatePassword(password)) {
            res.status(400).json({ message: "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters (including underscore)." });
            return;
        }

        // Check if user already exists
        const existingUserByEmail = await User.findOne({ where: { email } });
        if (existingUserByEmail) {
            res.status(400).json({ message: 'Email already in use. Please try another email.' });
            return;
        }

        const existingUserByUsername = await User.findOne({ where: { username } });
        if (existingUserByUsername) {
            res.status(400).json({ message: 'Username already exists. Please try another username.' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        // Create a new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            private: isPrivate || true, // Default to true if not provided
            model: model || "gpt-4",    // Default to "gpt-4" if not provided
            admin: admin || false,      // Default to false if not provided
            verificationToken,
            verificationTokenExpires,
            createdAt: new Date(),
            updatedAt: new Date(),
            totalCoins: 0,
        });

        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationToken, username);
        if (!emailSent) {
            await newUser.destroy(); // Rollback user creation if email sending fails
            res.status(500).json({ message: "Failed to send verification email. Please try again." });
            return;
        }

        res.status(201).json({
            message: "User registered successfully. Please check your email for the verification link.",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            },
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ message: error.errors.map(e => e.message).join(", ") });
        } else {
            console.error("Error during registration:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Email not found. Please check your email or register.' });
      return;
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Incorrect password. Please try again.' });
      return;
    } 

    } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            res.status(400).json({ message: "Invalid verification token" });
            return;
        }

        if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
            res.status(400).json({ message: "Verification token has expired" });
            return;
        }

        user.emailVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    console.log('Received forgot password request:', req.body);
    const { email } = req.body;

    try {
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            res.status(400).json({ message: 'Invalid email address' });
            return;
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'If this email exists in our system, you will receive a password reset link' });
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
        await user.save();

        const emailSent = await sendResetPasswordEmail(email, resetToken);
        if (!emailSent) {
            throw new Error('Email sending failed');
        }

        res.status(200).json({ message: 'If this email exists in our system, you will receive a password reset link' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    console.log('Reset Password Request:', req.body);
    const { token, newPassword } = req.body;

    try {
        if (!token || !newPassword) {
            res.status(400).json({ message: 'Invalid request. Token and new password are required.' });
            return;
        }

        const user = await User.findOne({ 
            where: { 
                resetPasswordToken: token,
                resetPasswordExpires: {
                    [Op.gt]: new Date() // Token not expired
                } 
            } 
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }

        if (!validatePassword(newPassword)) {
            res.status(400).json({ message: "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters." });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

export const validateResetToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ 
            where: { 
                resetPasswordToken: token,
                resetPasswordExpires: {
                    [Op.gt]: new Date() // Token not expired
                } 
            } 
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }

        res.status(200).json({ message: 'Valid reset token' });
    } catch (error) {
        console.error('Error during token validation:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};