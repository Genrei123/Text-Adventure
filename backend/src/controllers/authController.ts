import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/user";
import jwt from "jsonwebtoken";
import { ValidationError } from "sequelize";
import { RegisterRequestBody } from "../interfaces/RegisterRequestBody";
import { validatePassword } from "../utils/passwordValidator";
import { sendVerificationEmail, sendResetPasswordEmail } from '../service/emailService';
import crypto from 'crypto';

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

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour from now

        // Create a new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            private: isPrivate || true, // Default to true if not provided
            model: model || "gpt-4",    // Default to "gpt-4" if not provided
            admin: admin || false,      // Default to false if not provided
            verificationCode,
            verificationCodeExpires,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationCode);
        if (!emailSent) {
            await newUser.destroy(); // Rollback user creation if email sending fails
            res.status(500).json({ message: "Failed to send verification email. Please try again." });
            return;
        }

        res.status(201).json({
            message: "User registered successfully. Please check your email for the verification code.",
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
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(400).json({ message: "Invalid email or verification code" });
            return;
        }

        if (user.verificationCode !== code || !user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
            res.status(400).json({ message: "Invalid or expired verification code" });
            return;
        }

        user.emailVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    console.log('Received forgot password request:', req.body); // Debug log
    const { email } = req.body;
  
    try {
      // Validate email input
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ message: 'Please provide a valid email address' });
        return;
      }
  
      // Find the user and ensure email exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Use a generic message for security
        res.status(400).json({ message: 'If this email exists in our system, you will receive a password reset link' });
        return;
      }
  /*
      // Optional: Check if email is verified
      if (user.emailVerified === false) {
        res.status(400).json({ message: 'Please verify your email address first' });
        return;
      }
  */
      // Generate a more secure reset token
      const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
      
      // Update user with new reset token
      user.verificationCode = resetToken;
      user.verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour from now
      await user.save();
  
      // Attempt to send email
      try {
        const emailSent = await sendResetPasswordEmail(email, resetToken);
        if (!emailSent) {
          throw new Error('Email sending failed');
        }
      } catch (emailError) {
        // Roll back the token if email fails
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();
        
        console.error('Error sending reset email:', emailError);
        res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
        return;
      }
  
      // Success response
      res.status(200).json({ 
        message: 'If this email exists in our system, you will receive a password reset link',
        // For development only:
        debug: {
          resetToken,
          expiresAt: user.verificationCodeExpires
        }
      });
  
    } catch (error) {
      console.error('Error during forgot password:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.errors.map(e => e.message).join(", ") });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
      }
    }
  };