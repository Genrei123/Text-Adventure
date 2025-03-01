"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../controllers/auth/authController");
const router = (0, express_1.Router)();
router.post('/login', authController_1.login);
router.post('/register', authController_1.register);
router.post('/verify-email', authController_1.verifyEmail);
exports.default = router;
//# sourceMappingURL=routes.js.map