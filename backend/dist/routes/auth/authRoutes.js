"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("../../middlware/auth/google/passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../../middlware/auth/auth"));
const authController_1 = require("../../controllers/auth/authController");
// Create a function that returns the configured router
const createAuthRouter = (frontendUrl) => {
    const router = (0, express_1.Router)();
    router.post('/forgot-password', authController_1.forgotPassword);
    router.post('/validate-reset-token', authController_1.validateResetToken);
    router.post('/reset-password', authController_1.resetPassword);
    router.post('/check-username', authController_1.checkUsername);
    router.post('/check-email', authController_1.checkEmail);
    router.get('/', (req, res) => {
        res.send("Hello World!");
    });
    router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        if (req.user) {
            const user = req.user;
            const username = user.displayName || user.emails[0]?.value;
            const token = jsonwebtoken_1.default.sign({ id: user.id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.redirect(`${frontendUrl}/home?username=${encodeURIComponent(username)}`);
        }
        else {
            res.redirect('/?error=authentication_failed');
        }
    });
    router.get('/logout', (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            domain: process.env.DOMAIN,
            path: '/'
        });
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Failed to destroy session:', err);
                }
            });
        }
        res.json({
            message: 'Logged out successfully',
            redirectUrl: `${frontendUrl}/login`
        });
    });
    router.get("/protected", auth_1.default, (req, res) => {
        res.send("This is a protected route");
    });
    router.get('/:provider', (req, res, next) => {
        const { provider } = req.params;
        if (provider === 'google') {
            return passport_1.default.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
        }
        res.status(400).send("Unsupported provider");
    });
    router.get('/:provider/callback', (req, res, next) => {
        const { provider } = req.params;
        if (provider === 'google') {
            return passport_1.default.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
                if (err || !user) {
                    return res.redirect('/?error=authentication_failed');
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true });
                res.redirect('/');
            })(req, res, next);
        }
        res.status(400).send("Unsupported provider");
    });
    router.get('/verify-email/:token', authController_1.verifyEmail);
    // ... other routes
    return router;
};
exports.default = createAuthRouter;
//# sourceMappingURL=authRoutes.js.map