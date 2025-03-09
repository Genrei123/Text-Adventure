"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatTokenDetails = getChatTokenDetails;
const tiktoken_1 = require("tiktoken");
const enc = (0, tiktoken_1.get_encoding)("o200k_base"); // GPT-4o uses "o200k_base"
function getChatTokenDetails(messages) {
    if (!enc) {
        throw new Error("Encoder not initialized");
    }
    let tokenCount = 0;
    for (const message of messages) {
        // Removed `<|im_start|><|im_sep|><|im_end|>` that causes inflation on token count
        const formattedMessage = `${message.role}${message.content}`;
        tokenCount += enc.encode(formattedMessage).length;
    }
    // Add additional tokens for API metadata (OpenAI adds 3 extra tokens per message)
    // See: https://platform.openai.com/docs/api-reference/chat/create
    // Remove this is not raw GPT-4o
    tokenCount += messages.length * 3;
    return tokenCount;
}
//# sourceMappingURL=tokenizer.js.map