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
exports.checkEmail = exports.checkUsername = exports.verifyToken = exports.checkAuth = exports.logout = exports.validateResetToken = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../../model/user/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const passwordValidator_1 = require("../../utils/passwordValidator");
const emailService_1 = require("../../service/auth/emailService");
const crypto_1 = __importDefault(require("crypto"));
const generateVerificationToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, private: isPrivate, model, admin } = req.body;
    try {
        // Validate password
        if (!(0, passwordValidator_1.validatePassword)(password)) {
            res.status(400).json({ message: "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters (including underscore)." });
            return;
        }
        // Check if user already exists
        const existingUserByEmail = yield user_1.default.findOne({ where: { email } });
        if (existingUserByEmail) {
            res.status(400).json({ message: 'Email already in use. Please try another email.' });
            return;
        }
        const existingUserByUsername = yield user_1.default.findOne({ where: { username } });
        if (existingUserByUsername) {
            res.status(400).json({ message: 'Username already exists. Please try another username.' });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now
        // Create a new user
        const newUser = yield user_1.default.create({
            username,
            email,
            password: hashedPassword,
            private: isPrivate || true, // Default to true if not provided
            model: model || "gpt-4", // Default to "gpt-4" if not provided
            admin: admin || false, // Default to false if not provided
            verificationToken,
            verificationTokenExpires,
            createdAt: new Date(),
            updatedAt: new Date(),
            totalCoins: 0,
        });
        // Send verification email
        const emailSent = yield (0, emailService_1.sendVerificationEmail)(email, verificationToken, username);
        if (!emailSent) {
            yield newUser.destroy(); // Rollback user creation if email sending fails
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
    }
    catch (error) {
        if (error instanceof sequelize_1.ValidationError) {
            res.status(400).json({ message: error.errors.map(e => e.message).join(", ") });
        }
        else {
            console.error("Error during registration:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Email not found. Please check your email or register.' });
            return;
        }
        // Check if the password is correct
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
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
        const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, private: user.private, model: user.model, admin: user.admin } });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        const user = yield user_1.default.findOne({ where: { verificationToken: token } });
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
        yield user.save();
        res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.verifyEmail = verifyEmail;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received forgot password request:', req.body);
    const { email } = req.body;
    try {
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            res.status(400).json({ message: 'Invalid email address' });
            return;
        }
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'If this email exists in our system, you will receive a password reset link' });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
        yield user.save();
        const emailSent = yield (0, emailService_1.sendResetPasswordEmail)(email, resetToken);
        if (!emailSent) {
            throw new Error('Email sending failed');
        }
        res.status(200).json({ message: 'If this email exists in our system, you will receive a password reset link' });
    }
    catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Reset Password Request:', req.body);
    const { token, newPassword } = req.body;
    try {
        if (!token || !newPassword) {
            res.status(400).json({ message: 'Invalid request. Token and new password are required.' });
            return;
        }
        const user = yield user_1.default.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    [sequelize_1.Op.gt]: new Date() // Token not expired
                }
            }
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }
        if (!(0, passwordValidator_1.validatePassword)(newPassword)) {
            res.status(400).json({ message: "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters." });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        yield user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});
exports.resetPassword = resetPassword;
const validateResetToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const user = yield user_1.default.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    [sequelize_1.Op.gt]: new Date() // Token not expired
                }
            }
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }
        res.status(200).json({ message: 'Valid reset token' });
    }
    catch (error) {
        console.error('Error during token validation:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});
exports.validateResetToken = validateResetToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful', redirectUrl: '/login' });
});
exports.logout = logout;
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield user_1.default.findOne({ where: { email: decoded.email } });
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        res.status(200).json({ username: user.username });
    }
    catch (error) {
        console.error('Error during authentication check:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.checkAuth = checkAuth;
// New function to verify the token and return the user
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!token) {
            throw new Error('Token is missing');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield user_1.default.findOne({ where: { email: decoded.email } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    catch (error) {
        console.error('Token verification error:', error.message);
        return null;
    }
});
exports.verifyToken = verifyToken;
const checkUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ where: { username } });
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
        let validSuggestions = [];
        let attempts = 0;
        const maxAttempts = 10;
        while (validSuggestions.length < 3 && attempts < maxAttempts) {
            const currentSuggestion = baseSuggestions[validSuggestions.length];
            const exists = yield user_1.default.findOne({ where: { username: currentSuggestion } });
            if (!exists) {
                validSuggestions.push(currentSuggestion);
            }
            else {
                // If suggestion exists, create a new one
                const newSuggestion = `${username}${Math.floor(Math.random() * 9000) + 1000}`;
                const newExists = yield user_1.default.findOne({ where: { username: newSuggestion } });
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
    }
    catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.checkUsername = checkUsername;
const checkEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ where: { email } });
        res.json({
            available: !existingUser
        });
    }
    catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.checkEmail = checkEmail;
//# sourceMappingURL=authController.js.map