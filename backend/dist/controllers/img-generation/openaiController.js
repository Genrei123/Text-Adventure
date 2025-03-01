"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImage = void 0;
const axios_1 = __importDefault(require("axios"));
const generateImage = async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return; // Explicit return with void
    }
    try {
        const response = await axios_1.default.post('https://api.openai.com/v1/images/generations', {
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
                status: error.response?.status,
                data: error.response?.data,
            });
            res.status(500).json({
                error: 'Failed to generate image',
                details: error.response?.data || error.message
            });
        }
        else {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error generating image: ${errorMessage}`);
            res.status(500).json({ error: 'Failed to generate image' });
        }
    }
};
exports.generateImage = generateImage;
//# sourceMappingURL=openaiController.js.map