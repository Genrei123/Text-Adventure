"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const players_controller_1 = require("../controllers/players.controller");
const router = (0, express_1.Router)();
router.get('/', players_controller_1.getPlayers);
exports.default = router;
//# sourceMappingURL=players.js.map