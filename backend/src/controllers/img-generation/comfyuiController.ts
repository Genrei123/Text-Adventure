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

// Mapping of Model Names from the GameScreen to Workflow Files.
// Purpose: Dynamic loading of correct workflow file based on the selected model
const modeltoWorkflowMap: { [key: string]: string } = {
  'Stable Diffusion 1.5': 'sd1-5-pruned Workflow.json',
  'Stable Diffusion 1.5-anythingelse': 'sd1-5-anythingelse Workflow.json',
  'Stable Diffusion 3.0': 'sd3_medium_t5xxlfp8 Workflow.json',
  'Stable Diffusion XL': 'sdxl_base Workflow.json',
  'Stable Diffusion XL-Animagine': 'animagineXL Workflow.json',
  'Stable Diffusion XL-NoobAI-Base': 'noobaiXL_NAI Workflow.json',
  'Stable Diffusion XL-NoobAI-Ikastrious': 'ikastriousNoobai Workflow.json',
  'Stable Diffusion XL-Illustrious-coco': 'cocoIllustrious-v60 Workflow.json',
  'Stable Diffusion XL-Illustrious-Obsession': 'obsessionIllustrious-vPredV11 Workflow.json',
};
export const generateImage = async (req: Request, res: Response) => {
  const { prompt, negativePrompt, userId, gameId, model } = req.body;

  if (!prompt || !model) {
    res.status(400).json({ error: 'Prompt and model are required' });
    return;
  }

  // Check if the model is supported
  if (!modeltoWorkflowMap[model]) {
    res.status(400).json({ error: `Model "${model}" is not supported` });
    return;
  }

  try {
    console.log('Server received image generation request at:', new Date());
    
    // Ensure the image directory exists (similar to DALL-E implementation)
    // Leads/Creates a directory in public/image/chat-images to store the generated images
    const imageDir = path.join('public', 'images', 'chat-images');
    await mkdirAsync(imageDir, { recursive: true });
    
    // Load and configure workflow file based on the selected model
    // Purpose: Dynamically loads the correct workflow file for the selected StabilityAI model
    const workflowFile = modeltoWorkflowMap[model];
    const workflowPath = path.join(__dirname, '../../imagegen/comfyui/workflows', workflowFile);
    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));

    // Node 3 or '3' is the (POSITIVE) prompt node in the workflow
    // Node 4 or '4' is the (NEGATIVE) prompt node in the workflow
    // Node 2 or '2' is Random Seed (KSampler)
    // I basically just switched the node numbers to match the workflow file since the old one is just only uses one model.
    workflowData['3'].inputs.text = prompt;
    if (negativePrompt) {
      workflowData['4'].inputs.text = negativePrompt;
    }
    workflowData['2'].inputs.seed = Math.floor(Math.random() * 1000000000000);

    // Send prompt to ComfyUI
    // POST /prompt endpoint on ComfyUI server (via ngrok URL)
    const response = await axios.post(`${comfyUIUrl}/prompt`, { prompt: workflowData }, {
      timeout: 30000 // 30 second timeout
    });
    const promptId = response.data.prompt_id;
    console.log('Prompt ID:', promptId);

    // Checker for the image generation status
    let latestFile: string | undefined;
    const startTime = Date.now();
    const maxWaitTime = 60000; // 60 seconds 

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
            latestFile = saveImageNode.images[0].filename;
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

    // Generate a unique filename and copy the file to the public directory
    // Purpose: Makes the image accessible via a public URL
    const newFileName = `chat-image-${Date.now()}_${userId || 'unknown'}_${gameId || 'unknown'}.png`;
    const publicFilePath = path.join(imageDir, newFileName);
    await copyFileAsync(comfyFilePath, publicFilePath);
    console.log(`Copied image from ${comfyFilePath} to ${publicFilePath}`);

    // Create a relative URL for storing in the database
    const relativeImageUrl = `/images/chat-images/${newFileName}`;

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