"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const cors_2 = __importDefault(require("./config/cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const routes_1 = __importDefault(require("./routes/auth/routes"));
const userCRUDRoutes_1 = __importDefault(require("./routes/user/userCRUDRoutes"));
const invoiceRoutes_1 = __importDefault(require("./routes/transaction/invoiceRoutes"));
const shopRoutes_1 = __importDefault(require("./routes/transaction/shopRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/transaction/webhookRoutes"));
const authRoutes_1 = __importDefault(require("./routes/auth/authRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chat/chatRoutes"));
const coinRoutes_1 = __importDefault(require("./routes/coins/coinRoutes"));
const socket_1 = require("./websocket/socket");
const statsRoutes_1 = __importDefault(require("./routes/statistics/statsRoutes"));
const playerActivityRoutes_1 = __importDefault(require("./routes/statistics/playerActivityRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/game/gameRoutes"));
const shopRoutes_2 = __importDefault(require("./routes/transaction/shopRoutes"));
const nihRoutes_1 = __importDefault(require("./routes/game/nih-game/nihRoutes"));
const openaiRoute_1 = __importDefault(require("./routes/img-generation/openaiRoute"));
const banRoutes_1 = __importDefault(require("./routes/banRoutes"));
const metrics_1 = __importDefault(require("./routes/metrics"));
const players_1 = __importDefault(require("./routes/players"));
const models_1 = require("./service/models");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
// Middleware setup
app.use((0, cors_1.default)(cors_2.default));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Route setup
app.use('/auth', routes_1.default);
app.use('/admin', userCRUDRoutes_1.default);
app.use('/invoice', invoiceRoutes_1.default);
app.use('/shop', shopRoutes_1.default);
app.use('/webhook', webhookRoutes_1.default);
app.use('/gameplay', coinRoutes_1.default);
app.use('/ai', chatRoutes_1.default);
app.use('/statistics/statsRoutes', statsRoutes_1.default);
app.use('/statistics/playerActivityRoutes', playerActivityRoutes_1.default);
app.use('/game', gameRoutes_1.default);
app.use('/payments', shopRoutes_2.default);
app.use('/nih', nihRoutes_1.default);
app.use('/openai', openaiRoute_1.default);
app.use('/bans', banRoutes_1.default);
app.use('/api/bans', banRoutes_1.default);
app.use('/api/metrics', metrics_1.default);
app.use('/api/games', gameRoutes_1.default);
app.use('/api/players', players_1.default);
// Auth routes setup
const authRouter = (0, authRoutes_1.default)(frontendUrl);
app.use('/auth', authRouter);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error Stack:', err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
const server = (0, socket_1.createServer)(app);
server.listen(PORT, async () => {
    try {
        await (0, models_1.initializeModels)();
        console.log('Connection to the database has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map