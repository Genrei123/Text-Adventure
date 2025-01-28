import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/user";
import jwt from "jsonwebtoken";
import { ValidationError } from "sequelize";
import { RegisterRequestBody } from "../interfaces/RegisterRequestBody";
import { validatePassword } from "../utils/passwordValidator";
import { sendVerificationEmail } from "../service/emailService";
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
        const verificationCode = crypto.randomBytes(20).toString('hex');
        const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Create a new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            private: isPrivate || true, // Default to true if not provided
            model: model || "gpt-4",    // Default to "gpt-4" if not provided
            admin: admin || false,      // Default to false if not provided
            verificationCode,
            verificationExpiry
        });

        // Send verification email
        await sendVerificationEmail(username, email, verificationCode);

        res.status(201).json({
            message: 'Registration successful! A verification email has been sent to your email address.',
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

    // Generate a token (e.g., JWT)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;

    try {
        const user = await User.findOne({ where: { verificationCode: code } });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired verification code.' });
            return;
        }

        if (user.verificationExpiry && user.verificationExpiry < new Date()) {
            res.status(400).json({ message: 'Verification code has expired.' });
            return;
        }

        user.verificationCode = undefined;
        user.verificationExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).json({ message: "Server error" });
    }
};