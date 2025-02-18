import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

interface ImageGenerationRequest {
    prompt: string;
    n?: number;
    size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
    model?: 'dall-e-2' | 'dall-e-3';
}

export const generateImage = async (req: Request, res: Response) => {
    try {
        const {
            prompt,
            n = 1,
            size = '1724x1024',
            quality = 'standard',
            style = 'natural',
            model = 'dall-e-3'
        } = req.body as ImageGenerationRequest;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        // DALL-E 3 specific validations
        if (model === 'dall-e-3') {
            if (n > 1) {
                return res.status(400).json({
                    success: false,
                    error: 'DALL-E 3 can only generate 1 image at a time'
                });
            }
        } else {
            // DALL-E 2 validations
            if (n < 1 || n > 10) {
                return res.status(400).json({
                    success: false,
                    error: 'Number of images must be between 1 and 10 for DALL-E 2'
                });
            }
        }

        const response = await openai.images.generate({
            model,
            prompt,
            n,
            size,
            quality,
            style,
        });

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error: any) {
        console.error('DALL-E image generation error:', error);

        // Handle specific OpenAI API errors
        if (error instanceof OpenAI.APIError) {
            return res.status(error.status || 500).json({
                success: false,
                error: error.message,
                code: error.code,
                type: error.type
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Internal server error during image generation'
        });
    }
};