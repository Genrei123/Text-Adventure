"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shopController_1 = require("../../controllers/transaction/shopController");
const router = express_1.default.Router();
router.get('/coins/:userId', shopController_1.getCoins);
router.post('/deduct-coins', shopController_1.deductCoins);
exports.default = router;
//# sourceMappingURL=coinRoutes.js.map