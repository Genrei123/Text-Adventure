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
exports.generateImage = void 0;
const axios_1 = __importDefault(require("axios"));
const generateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { prompt } = req.body;
    if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return; // Explicit return with void
    }
    try {
        const response = yield axios_1.default.post('https://api.openai.com/v1/images/generations', {
            prompt,
            n: 1,
            size: '1024x1024',
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.MY_OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const imageUrl = response.data.data[0].url;
        res.json({ imageUrl });
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Error generating image:', {
                message: error.message,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
            });
            res.status(500).json({
                error: 'Failed to generate image',
                details: ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message
            });
        }
        else {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error generating image: ${errorMessage}`);
            res.status(500).json({ error: 'Failed to generate image' });
        }
    }
});
exports.generateImage = generateImage;
//# sourceMappingURL=openaiController.js.map