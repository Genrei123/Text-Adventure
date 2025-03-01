import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../model/user/user";
import jwt from "jsonwebtoken";
import { ValidationError, Op } from "sequelize";
import { RegisterRequestBody } from "../../interfaces/auth/RegisterRequestBody";
import { validatePassword } from "../../utils/passwordValidator";
import { sendVerificationEmail, sendResetPasswordEmail } from '../../service/auth/emailService';
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
            res.status(401).json({ message: 'Incorrect account credentials. Please try again.' });
            return;
        }

        // Check if the email is verified
        if (!user.emailVerified) {
            res.status(401).json({ message: 'Email not verified. Please check your email for the verification link.' });
            return;
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, private: user.private, model: user.model, admin: user.admin } });

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

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful', redirectUrl: '/login' });
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        res.status(200).json({ username: user.username });
    } catch (error) {
        console.error('Error during authentication check:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// New function to verify the token and return the user
// New function to verify the token and return the user
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    try {
        if (!token) {
            res.status(400).json({ message: 'Token is missing' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ valid: true, message: 'Token is valid' });
    } catch (error: any) {
        console.error('Token verification error:', error.message);
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
};

export const checkUsername = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.body;
    
    try {
        const existingUser = await User.findOne({ where: { username } });
        
        if (!existingUser) {
            res.json({ available: true });
            return;
        }

        // Generate base suggestions
        const baseSuggestions = [
            // Random number between 100-999
            `${username}${Math.floor(Math.random() * 900) + 100}`,
            // Random underscore and number
            `${username}_${Math.floor(Math.random() * 90) + 10}`,
            // Current year with random letter
            `${username}.${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${new Date().getFullYear().toString().slice(2)}`
        ];

        // Check all suggestions at once and generate new ones if they exist
        let validSuggestions: string[] = [];
        let attempts = 0;
        const maxAttempts = 10;

        while (validSuggestions.length < 3 && attempts < maxAttempts) {
            const currentSuggestion = baseSuggestions[validSuggestions.length];
            const exists = await User.findOne({ where: { username: currentSuggestion } });
            
            if (!exists) {
                validSuggestions.push(currentSuggestion);
            } else {
                // If suggestion exists, create a new one
                const newSuggestion = `${username}${Math.floor(Math.random() * 9000) + 1000}`;
                const newExists = await User.findOne({ where: { username: newSuggestion } });
                if (!newExists) {
                    validSuggestions.push(newSuggestion);
                }
            }
            attempts++;
        }

        res.json({
            available: false,
            suggestions: validSuggestions
        });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const checkEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    
    try {
        const existingUser = await User.findOne({ where: { email } });
        
        res.json({
            available: !existingUser
        });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'Server error' });
    }
};