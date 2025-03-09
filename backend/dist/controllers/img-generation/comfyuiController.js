"use strict";
// THIS WILL ONLY WORK WHEN I RUN COMFYUI ON MY LOCAL MACHINE
// I WILL NEED TO RUN COMFYUI ON THE SERVER TO MAKE THIS WORK ! ! !
// THEN HAVE API RAN OR SOME STUFF CYKA ! ! !
/*
import { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const modelPath = path.join(__dirname, '../../../path/to/sd3_medium_incl_clips.safetensors');
const workflowPath = path.join(__dirname, '../../../img2img.json');
const outputDir = path.join(__dirname, '../../../generated_images');

export const generateImage = async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Update the workflow JSON with the new prompt
    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
    workflow['7'].inputs.text = prompt;

    // Save the updated workflow to a temporary file
    const tempWorkflowPath = path.join(outputDir, 'temp_workflow.json');
    fs.writeFileSync(tempWorkflowPath, JSON.stringify(workflow, null, 2));

    // Run ComfyUI with the updated workflow
    exec(`comfyui --workflow ${tempWorkflowPath} --output ${outputDir}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating image: ${error.message}`);
        return res.status(500).json({ error: 'Failed to generate image' });
      }

      // Find the generated image
      const files = fs.readdirSync(outputDir);
      const imageFile = files.find(file => file.endsWith('.png'));

      if (!imageFile) {
        return res.status(500).json({ error: 'No image generated' });
      }

      const imageUrl = `http://localhost:3000/generated_images/${imageFile}`;
      res.json({ imageUrl });
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

*/ // Had to comment this out because I have to do OpenAI API stuff first before this.
//# sourceMappingURL=comfyuiController.js.map