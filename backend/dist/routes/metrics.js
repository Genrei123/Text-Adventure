"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metrics_controller_1 = require("../controllers/metrics.controller");
const router = (0, express_1.Router)();
router.get('/', metrics_controller_1.getMetrics);
router.get('/games', metrics_controller_1.getGamesCount);
exports.default = router;
//# sourceMappingURL=metrics.js.map