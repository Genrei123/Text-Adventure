import fs from 'fs';
import path from 'path';
import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';

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

// ComfyUI Server URL (Local)
const comfyUIUrl = 'http://127.0.0.1:8188';

// Output directory for generated images (Local)
const outputDir = path.join(__dirname, '../../../../../../Stable Diffusion/ComfyUI_windows_portable/ComfyUI/output');

// NGROK URL (NAGBABAGO LAGI RAAAAA)
// Every start of the server, the URL will become invalid. So, you need to update the URL when you run ngrok once more.
const publicBaseUrl = 'https://54f0-2405-8d40-4819-a640-e505-70e1-b0bf-8421.ngrok-free.app';

export const generateImage = async (req: Request, res: Response) => {
  try {
    console.log('Server received request at:', new Date());
    const workflowPath = path.join(__dirname, '../../imagegen/comfyui/workflows/prompt2img.json');
    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));

    workflowData['7'].inputs.text = req.body.prompt || "A cyberpunk cityscape with neon lights";
    if (req.body.negativePrompt) {
      workflowData['8'].inputs.text = req.body.negativePrompt;
    }
    workflowData['4'].inputs.seed = Math.floor(Math.random() * 1000000000000);

    // Send prompt to ComfyUI
    const response = await axios.post(`${comfyUIUrl}/prompt`, { prompt: workflowData });
    const promptId = response.data.prompt_id;
    console.log('Prompt ID:', promptId);

    // Poll ComfyUI history to wait for completion
    let latestFile: string | undefined;
    const startTime = Date.now();
    const maxWaitTime = 60000; // 60 seconds max wait

    while (Date.now() - startTime < maxWaitTime) {
      const historyResponse = await axios.get(`${comfyUIUrl}/history/${promptId}`);
      const historyData = historyResponse.data as ComfyUIHistory; // Type the entire response
      const promptData = historyData[promptId]; // Access dynamically

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
    }

    if (!latestFile) {
      throw new Error('Image generation did not complete within 60 seconds');
    }

    // Verify the file exists
    const filePath = path.join(outputDir, latestFile);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Generated file ${latestFile} not found in ${outputDir}`);
    }

    console.log('Output Dir:', outputDir);
    console.log('Output Dir Contents:', fs.readdirSync(outputDir));
    console.log('Latest File:', latestFile);
    console.log('Generated URL:', `${publicBaseUrl}/images/${latestFile}`);

    const imageUrl = `/images/${latestFile}`;

    res.json({
      promptId,
      message: 'Image generation queued with ComfyUI',
      imageUrl: `${publicBaseUrl}${imageUrl}`
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Server Error:', axiosError.response?.data || axiosError.message);
    res.status(500).json({ error: axiosError.message });
  }
};