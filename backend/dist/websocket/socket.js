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
exports.playerSessions = void 0;
exports.createServer = createServer;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const websocketConfig_1 = __importDefault(require("../config/websocketConfig"));
const cors_1 = __importDefault(require("../config/cors"));
const authController_1 = require("../controllers/auth/authController"); // Import verifyToken function
const activeUser_1 = require("../shared/websocket/activeUser"); // Import activeUserEmails
const winston_1 = __importDefault(require("winston"));
const session_1 = __importDefault(require("../model/session")); // Import Session model
const axios_1 = __importDefault(require("axios")); // Import axios
// Initialize Winston Logger
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)),
    transports: [new winston_1.default.transports.Console(), new winston_1.default.transports.File({ filename: 'server.log' })],
});
exports.playerSessions = new Map(); // Export playerSessions
const userSockets = new Map(); // Track multiple sockets per user
function createServer(app) {
    const server = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(server, { cors: cors_1.default });
    const logPlayerStats = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${process.env.SITE_URL}/statistics/statsRoutes/player-stats`);
            const activePlayers = response.data.activePlayers;
            logger.info(`Active players: ${activePlayers}`);
        }
        catch (error) {
            logger.error('Error fetching active player count:', error);
        }
    });
    io.on('connection', (socket) => {
        logger.info(`New socket connected: ${socket.id}`);
        socket.on('join', (_a) => __awaiter(this, [_a], void 0, function* ({ route, email, token }) {
            var _b, _c;
            logger.debug(`Join event received: route=${route}, email=${email}, token=${token}`);
            if (!route) {
                logger.error('Route is missing');
                return;
            }
            logger.info(`New connection from route: ${route}`);
            logger.info(`Token received: ${token}`);
            logger.info(`Email received: ${email}`);
            try {
                const user = yield (0, authController_1.verifyToken)(token);
                if (!user || !user.email) {
                    logger.warn(`Invalid token or user email missing.`);
                    return;
                }
                const userEmail = user.email;
                if (websocketConfig_1.default.some(includedRoute => route.includes(includedRoute))) {
                    if (!userSockets.has(userEmail)) {
                        userSockets.set(userEmail, new Set());
                    }
                    (_b = userSockets.get(userEmail)) === null || _b === void 0 ? void 0 : _b.add(socket.id);
                    if (((_c = userSockets.get(userEmail)) === null || _c === void 0 ? void 0 : _c.size) === 1) {
                        activeUser_1.activeUserEmails.add(userEmail); // Add to activeUserEmails
                        io.emit('playerCount', { activePlayers: activeUser_1.activeUserEmails.size });
                        yield logPlayerStats();
                        if (!exports.playerSessions.has(userEmail)) {
                            exports.playerSessions.set(userEmail, { startTime: new Date(), sessionData: { interactions: {}, gamesCreated: {}, gamesPlayed: {}, visitedPages: {} } });
                            logger.info(`Session created for ${userEmail}`);
                        }
                    }
                    logger.info(`User ${userEmail} joined. Active players: ${activeUser_1.activeUserEmails.size} as of ${new Date().toLocaleString()}`);
                }
                else {
                    logger.warn(`Route does not match included routes.`);
                }
            }
            catch (error) {
                logger.error(`Error during join event: ${error.message}`);
            }
        }));
        socket.on('interaction', ({ email, interaction, page }) => {
            logger.debug(`Interaction event received: email=${email}, interaction=${interaction}, page=${page}`);
            const session = exports.playerSessions.get(email);
            if (session) {
                session.sessionData.interactions[interaction] = (session.sessionData.interactions[interaction] || 0) + 1;
                if (interaction.startsWith('created:')) {
                    const game = interaction.replace('created:', '');
                    session.sessionData.gamesCreated[game] = (session.sessionData.gamesCreated[game] || 0) + 1;
                }
                else if (interaction.startsWith('played:')) {
                    const game = interaction.replace('played:', '');
                    session.sessionData.gamesPlayed[game] = (session.sessionData.gamesPlayed[game] || 0) + 1;
                }
                if (page) {
                    session.sessionData.visitedPages[page] = (session.sessionData.visitedPages[page] || 0) + 1; // Log the visited page
                    logger.info(`Visited page added for ${email}: ${page}`);
                }
                logger.info(`Interaction logged for ${email}: ${interaction}, page: ${page}`);
                logger.debug(`Current session data for ${email}: ${JSON.stringify(session)}`);
            }
            else {
                logger.warn(`No session found for ${email}`);
            }
        });
        socket.on('leave', (_a) => __awaiter(this, [_a], void 0, function* ({ route, email, token }) {
            var _b, _c, _d;
            logger.debug(`Leave event received: route=${route}, email=${email}, token=${token}`);
            if (!route) {
                logger.error('Route is missing');
                return;
            }
            logger.info(`Disconnection from route: ${route}`);
            logger.info(`Email received: ${email}`);
            try {
                const user = yield (0, authController_1.verifyToken)(token);
                if (!user || !user.email) {
                    logger.warn(`Invalid token or user email missing.`);
                    return;
                }
                const userEmail = user.email;
                if (websocketConfig_1.default.some(includedRoute => route.includes(includedRoute))) {
                    if (userSockets.has(userEmail) && ((_b = userSockets.get(userEmail)) === null || _b === void 0 ? void 0 : _b.has(socket.id))) {
                        (_c = userSockets.get(userEmail)) === null || _c === void 0 ? void 0 : _c.delete(socket.id);
                        if (((_d = userSockets.get(userEmail)) === null || _d === void 0 ? void 0 : _d.size) === 0) {
                            activeUser_1.activeUserEmails.delete(userEmail); // Remove from activeUserEmails
                            io.emit('playerCount', { activePlayers: activeUser_1.activeUserEmails.size });
                            userSockets.delete(userEmail);
                            const session = exports.playerSessions.get(userEmail);
                            if (session) {
                                session.endTime = new Date();
                                logger.debug(`Final session data for ${userEmail}: ${JSON.stringify(session)}`);
                                yield session_1.default.create({
                                    email: userEmail,
                                    startTime: session.startTime,
                                    endTime: session.endTime,
                                    sessionData: session.sessionData,
                                });
                                logger.info(`Session ended for ${userEmail}:`, session);
                                exports.playerSessions.delete(userEmail);
                            }
                            else {
                                logger.warn(`No session found for ${userEmail} during leave event`);
                            }
                        }
                    }
                    logger.info(`User ${userEmail} left. Active players: ${activeUser_1.activeUserEmails.size} as of ${new Date().toLocaleString()}`);
                }
                else {
                    logger.warn(`Route does not match included routes.`);
                }
            }
            catch (error) {
                logger.error(`Error during leave event: ${error.message}`);
            }
        }));
        socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
            logger.info(`Socket disconnected: ${socket.id}`);
            for (const [userEmail, sockets] of userSockets.entries()) {
                if (sockets.has(socket.id)) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) {
                        activeUser_1.activeUserEmails.delete(userEmail); // Remove from activeUserEmails
                        io.emit('playerCount', { activePlayers: activeUser_1.activeUserEmails.size });
                        userSockets.delete(userEmail);
                        const session = exports.playerSessions.get(userEmail);
                        if (session) {
                            session.endTime = new Date();
                            logger.debug(`Final session data for ${userEmail}: ${JSON.stringify(session)}`);
                            yield session_1.default.create({
                                email: userEmail,
                                startTime: session.startTime,
                                endTime: session.endTime,
                                sessionData: session.sessionData,
                            });
                            exports.playerSessions.delete(userEmail);
                            logger.info(`Cleaned up session for ${userEmail}`);
                        }
                        else {
                            logger.warn(`No session found for ${userEmail} during disconnect event`);
                        }
                    }
                    break;
                }
            }
        }));
    });
    return server;
}
//# sourceMappingURL=socket.js.map