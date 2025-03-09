"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGamesCount = exports.fetchMetrics = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';
const fetchMetrics = async () => {
    const response = await axios_1.default.get(`${API_URL}/api/metrics`);
    return response.data;
};
exports.fetchMetrics = fetchMetrics;
const fetchGamesCount = async () => {
    const response = await axios_1.default.get(`${API_URL}/api/metrics/games`);
    return response.data;
};
exports.fetchGamesCount = fetchGamesCount;
//# sourceMappingURL=metrics.service.js.map