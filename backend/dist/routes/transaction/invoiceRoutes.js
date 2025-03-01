"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoiceController_1 = require("../../controllers/transaction/invoiceController");
const router = (0, express_1.Router)();
router.post('/create-invoice', async (req, res) => {
    try {
        await (0, invoiceController_1.createInvoice)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=invoiceRoutes.js.map