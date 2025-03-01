"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!googleClientID || !googleClientSecret) {
    throw new Error('Missing Google OAuth credentials in environment variables');
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: "/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Here you can save the user profile to your database
    return done(null, profile);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map