import { Router } from 'express';
import { generateImage as generateImageComfyUI } from '../../controllers/img-generation/comfyuiController';
import { generateImage as generateImageOpenAI } from '../../controllers/img-generation/openaiController';

const router = Router();

// Route: POST /generate-image
// Purpose: Unified endpoint for image generation, routes to either OpenAI or ComfyUI based on the provider
// Inputs: Request body containing prompt, userId, gameId, model, and provider
// Outputs: JSON response with the generated image URL or an error message
router.post('/generate-image', async (req, res) => {
  const { provider } = req.body;

  // Validate the provider
  if (!['OpenAI', 'StabilityAI'].includes(provider)) { 
    res.status(400).json({ error: `Unsupported provider: ${provider}` });
    return;
  }

  // Route to the appropriate controller based on the provider
  if (provider === 'OpenAI') {
    // Leads to: generateImage function in openaiController.ts
    await generateImageOpenAI(req, res);
  } else {
    // Leads to: generateImage function in comfyuiController.ts
    await generateImageComfyUI(req, res);
  }
});

export default router;