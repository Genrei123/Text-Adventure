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
exports.fetchGamesCount = exports.fetchMetrics = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const fetchMetrics = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${API_URL}/api/metrics`);
    return response.data;
});
exports.fetchMetrics = fetchMetrics;
const fetchGamesCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${API_URL}/api/metrics/games`);
    return response.data;
});
exports.fetchGamesCount = fetchGamesCount;
//# sourceMappingURL=metrics.service.js.map