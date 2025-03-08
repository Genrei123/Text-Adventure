import fs from 'fs';
import path from 'path';
import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';

const comfyUIUrl = 'http://127.0.0.1:8188';

export const generateImage = async (req: Request, res: Response) => {
  try {
    // Load the full workflow from prompt2img.json
    const workflowPath = path.join(__dirname, '../../imagegen/comfyui/workflows/prompt2img.json');
    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));

    // Update Node 7 (positive prompt)
    workflowData['7'].inputs.text = req.body.prompt || "A cyberpunk cityscape with neon lights";

    // Update Node 8 (negative prompt) if provided
    if (req.body.negativePrompt) {
      workflowData['8'].inputs.text = req.body.negativePrompt;
    }

    // Send the full workflow to ComfyUI
    const response = await axios.post(`${comfyUIUrl}/prompt`, { prompt: workflowData });
    const promptId = response.data.prompt_id;

    res.json({ promptId, message: 'Image generation queued with ComfyUI' });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('ComfyUI Error:', axiosError.response?.data || axiosError.message);
    res.status(500).json({ error: axiosError.message });
  }
};