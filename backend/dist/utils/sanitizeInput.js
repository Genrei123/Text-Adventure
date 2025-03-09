"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = void 0;
const sanitizeInput = (input) => {
    // Implement sanitization logic (e.g., removing harmful characters)
    return input.replace(/<[^>]*>?/gm, ''); // Example: Remove HTML tags
};
exports.sanitizeInput = sanitizeInput;
//# sourceMappingURL=sanitizeInput.js.map