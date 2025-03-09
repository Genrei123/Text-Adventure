"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openaiController_1 = require("../../controllers/img-generation/openaiController");
const router = (0, express_1.Router)();
router.post('/generate-image', openaiController_1.generateImage);
// Must put requestHandler on generateImage if still doesn't work later on.
exports.default = router;
//# sourceMappingURL=openaiRoute.js.map