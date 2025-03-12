import fs from 'fs';
import path from 'path';
import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { promisify } from 'util';

const copyFileAsync = promisify(fs.copyFile);
const mkdirAsync = promisify(fs.mkdir);

// Define a basic type for ComfyUI history response
interface ComfyUIHistory {
  [promptId: string]: {
    status: { completed: boolean };
    outputs: {
      [nodeId: string]: {
        images?: Array<{
          filename: string;
          // Add other fields if needed (e.g., type, subtype)
        }>;
      };
    };
  };
}

// ComfyUI Server URL (using environment variable)
const comfyUIUrl = process.env.COMFYUI_NGROK_URL;

// Output directory for generated images (Local ComfyUI directory)
const comfyOutputDir = path.join(__dirname, '../../../../../../Stable Diffusion/ComfyUI_windows_portable/ComfyUI/output');

export const generateImage = async (req: Request, res: Response) => {
  const { prompt, negativePrompt, userId, gameId } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  try {
    console.log('Server received image generation request at:', new Date());
    
    // Ensure the image directory exists (similar to DALL-E implementation)
    const imageDir = path.join('public', 'images', 'sdx', 'chat-images');
    await mkdirAsync(imageDir, { recursive: true });
    
    // Load and configure workflow
    const workflowPath = path.join(__dirname, '../../imagegen/comfyui/workflows/prompt2img.json');
    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));

    workflowData['7'].inputs.text = prompt;
    if (negativePrompt) {
      workflowData['8'].inputs.text = negativePrompt;
    }
    workflowData['4'].inputs.seed = Math.floor(Math.random() * 1000000000000);

    // Send prompt to ComfyUI
    const response = await axios.post(`${comfyUIUrl}/prompt`, { prompt: workflowData }, {
      timeout: 30000 // 30 second timeout
    });
    const promptId = response.data.prompt_id;
    console.log('Prompt ID:', promptId);

    // Poll ComfyUI history to wait for completion
    let latestFile: string | undefined;
    const startTime = Date.now();
    const maxWaitTime = 60000; // 60 seconds max wait

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const historyResponse = await axios.get(`${comfyUIUrl}/history/${promptId}`, {
          timeout: 10000 // 10 second timeout
        });
        const historyData = historyResponse.data as ComfyUIHistory;
        const promptData = historyData[promptId];

        if (promptData && promptData.status && promptData.status.completed) {
          // Extract the output filename from the history
          const outputs = promptData.outputs;
          const saveImageNode = Object.values(outputs).find((output: any) =>
            output && output.images && output.images.length > 0
          );
          if (saveImageNode && saveImageNode.images) {
            const imageInfo = saveImageNode.images[0];
            latestFile = imageInfo.filename;
            console.log('Image generation completed. Filename from history:', latestFile);
            break;
          }
        }

        console.log('Waiting for generation to complete...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      } catch (error) {
        console.error('Error fetching history:', error);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Longer wait on error
      }
    }

    if (!latestFile) {
      throw new Error('Image generation did not complete within 60 seconds');
    }

    // Verify the file exists in ComfyUI output directory
    const comfyFilePath = path.join(comfyOutputDir, latestFile);
    if (!fs.existsSync(comfyFilePath)) {
      throw new Error(`Generated file ${latestFile} not found in ${comfyOutputDir}`);
    }

    // Generate a unique filename (similar to DALL-E implementation)
    const newFileName = `chat-image-${Date.now()}_${userId || 'unknown'}_${gameId || 'unknown'}.png`;
    const publicFilePath = path.join(imageDir, newFileName);
    
    // Copy the file from ComfyUI output to our public directory
    await copyFileAsync(comfyFilePath, publicFilePath);
    console.log(`Copied image from ${comfyFilePath} to ${publicFilePath}`);

    // Create a relative URL for storing in the database (similar to DALL-E implementation)
    const relativeImageUrl = `/images/chat-images/sdxl/${newFileName}`;

    res.json({
      promptId,
      message: 'Image generation completed with ComfyUI',
      imageUrl: relativeImageUrl,
      gameId: gameId || null
    });
  } catch (error) {
    console.error('Full error details:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      res.status(500).json({ 
        error: 'Failed to generate image with ComfyUI', 
        details: error.response?.data || error.message 
      });
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error generating image with ComfyUI: ${errorMessage}`);
      res.status(500).json({ error: 'Failed to generate image with ComfyUI' });
    }
  }
};