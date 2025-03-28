import { Request, Response } from 'express';
import axios from 'axios';
import Game from '../../model/game/game';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Removed the ComfyUI specifics and focused on OpenAI
// Function: generateImage
// Purpose: Handles image generation using OpenAI's DALL-E models (DALL-E 2 and DALL-E 3)
// Inputs: Request body containing prompt, userId, gameId, and model
// Outputs: JSON response with the generated image URL or an error message
export const generateImage = async (req: Request, res: Response): Promise<void> => {
  const { prompt, userId, gameId, model } = req.body;

  if (!prompt || !userId || !gameId || !model) {
    res.status(400).json({ error: 'Missing required fields: prompt, userId, gameId, or model' });
    return;
  }

  // Validate the model (only DALL-E 2 and DALL-E 3 are supported)
  if (!['DALL-E 2', 'DALL-E 3'].includes(model)) {
    res.status(400).json({ error: `Unsupported OpenAI model: ${model}` });
    return;
  }

  try {
    // Ensure the image directory exists
    // Leads to: Creates a directory in public/images/chat-images to store the generated image
    const imageDir = path.join('public', 'images', 'chat-images');
    await mkdirAsync(imageDir, { recursive: true });

    // Map the model name to OpenAI's model identifier
    const openAiModel = model === 'DALL-E 2' ? 'dall-e-2' : 'dall-e-3';

    // Send request to OpenAI API to generate the image
    // Leads to: POST /images/generations endpoint on OpenAI API
      const openAiResponse = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: openAiModel,
          prompt,
          n: 1,
          size: '1024x1024',
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.MY_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const imageUrlFromDalle = openAiResponse.data.data[0].url;

      // Download the DALL-E image
      const imageResponse = await axios({
        method: 'get',
        url: imageUrlFromDalle,
        responseType: 'arraybuffer',
      });

      // Generate a unique filename
      const newFileName = `chat-image-${Date.now()}_${userId}_${gameId}.png`;
      const publicFilePath = path.join(imageDir, newFileName);

      // Save the image to disk
      await writeFileAsync(publicFilePath, imageResponse.data);

      // Create a relative URL for storing in the database
      const relativeImageUrl = `/images/chat-images/${newFileName}`;

      // Return the response with the image URL
      res.json({ 
        imageUrl: relativeImageUrl, 
        gameId 
      });
        } catch (error: unknown) {
      console.error('Full error details:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      res.status(500).json({
        error: 'Failed to generate chat image',
        details: error.response?.data || error.message,
      });
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error generating chat image: ${errorMessage}`);
      res.status(500).json({ error: 'Failed to generate chat image' });
    }
  }
};

// Function: generateBannerImage
// Purpose: Generates a banner image using DALL-E 3
// Inputs: Request body containing prompt
// Outputs: JSON response with the generated image URL or an error message

// BY DEFAULT I SET IT AS DALL-E 3 BECAUSE I WANT THE BANNER TO LOOK PRETTY COOL AND ON IT'S LATEST IMAGES CUZ WHY NOTAJIGNAIUGNAIJONGIJOAS
export const generateBannerImage = async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  try {
    // Ensure the image directory exists
    const imageDir = path.join('public', 'images', 'banner-images');
    await mkdirAsync(imageDir, { recursive: true });

    // Call OpenAI API to generate the image
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MY_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the image URL from the response
    const imageUrl = openAiResponse.data.data[0].url;

    // Download the image
    const imageResponse = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    // Generate a unique filename
    const filename = `banner-image-${Date.now()}.png`;
    const filepath = path.join(imageDir, filename);

    // Save Image to Disk
    await writeFileAsync(filepath, imageResponse.data);

    // Create a relative URL for storing in the database
    const relativeImageUrl = `/images/banner-images/${filename}`;

    res.json({ imageUrl: relativeImageUrl });

  } catch (error: unknown) { 
    console.error('Full error details:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      res.status(500).json({ 
        error: 'Failed to generate banner image', 
        details: error.response?.data || error.message 
      });
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error generating banner image: ${errorMessage}`);
      res.status(500).json({ error: 'Failed to generate banner image' });
    }
  }
};

// Function: generateGameCoverImage
// Purpose: Generates a game cover image using DALL-E 3 and updates the Game model
// Inputs: Request body containing prompt, gameId, and userId
// Outputs: JSON response with the generated image URL and gameId

// Yep! I still choosed DALL-E 3 for the game cover image because it looks better than DALL-E 2 and I want the game cover to look pretty cool and on it's latest images CUZ WHY NOTAJIGNAIUGNAIJONGIJOAS (not again... I swear)
export const generateGameCoverImage = async (req: Request, res: Response): Promise<void> => {
  const { prompt, gameId, userId } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  try {
    // Ensure the image directory exists
    const imageDir = path.join('public', 'images', 'game-images');
    await mkdirAsync(imageDir, { recursive: true });

    // Call OpenAI API to generate the image
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MY_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the image URL from the response
    const imageUrl = openAiResponse.data.data[0].url;

    // Download the image
    const imageResponse = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    // Generate a unique filename
    const filename = `game-image-${Date.now()}.png`;
    const filepath = path.join(imageDir, filename);

    // Save the image to disk
    await writeFileAsync(filepath, imageResponse.data);

    // Create a relative URL for storing in the database
    const relativeImageUrl = `/images/game-images/${filename}`;

    // If gameId is provided, update the existing game
    if (gameId) {
      const game = await Game.findByPk(gameId);
      
      if (game) {
        game.image_data = relativeImageUrl;
        await game.save();

        res.json({ 
          imageUrl: relativeImageUrl, 
          gameId: game.id 
        });
        return;
      }
    }

    // If no gameId, create a new game with the image
    const newGame = await Game.create({
      title: 'Untitled Game',
      slug: `untitled-game-${Date.now()}`,
      description: 'Generated game',
      tagline: 'Temporary tagline',
      genre: 'Unknown',
      subgenre: 'Unknown',
      image_data: relativeImageUrl,
      UserId: userId || null,
      private: false,
      prompt_name: 'Default Prompt',
      prompt_text: '',
      prompt_model: 'gpt-3.5-turbo',
      image_prompt_text: prompt,
      image_prompt_name: 'Generated Image',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ 
      imageUrl: relativeImageUrl, 
      gameId: newGame.id 
    });

  } catch (error: unknown) { 
    console.error('Full error details:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      res.status(500).json({ 
        error: 'Failed to generate game cover image', 
        details: error.response?.data || error.message 
      });
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error generating game cover image: ${errorMessage}`);
      res.status(500).json({ error: 'Failed to generate game cover image' });
    }
  }
};

// Function: generateChatImage
// Purpose: Generates a chat image using DALL-E 3 (legacy function, can be removed if not needed)
// Inputs: Request body containing prompt and gameId
// Outputs: JSON response with the generated image URL and gameId

// No, I'm not saying it again. I just wanted DALL-E 3 by default... ;)
// Wait, this function, it's for... (shhh, I know.)
export const generateChatImage = async (req: Request, res: Response): Promise<void> => {
  const { prompt, gameId } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  try {
    // Ensure the image directory exists
    const imageDir = path.join('public', 'images', 'chat-images');
    await mkdirAsync(imageDir, { recursive: true });

    // Call OpenAI API to generate the image
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MY_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the image URL from the response
    const imageUrl = openAiResponse.data.data[0].url;

    // Download the image
    const imageResponse = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    // Generate a unique filename
    const filename = `chat-image-${Date.now()}.png`;
    const filepath = path.join(imageDir, filename);

    // Save Image to Disk
    await writeFileAsync(filepath, imageResponse.data);

    // Create a relative URL for storing in the database
    const relativeImageUrl = `/images/chat-images/${filename}`;

    // IMPORTANT: This function does NOT update the Game model
    res.json({ 
      imageUrl: relativeImageUrl,
      gameId: gameId // Just pass back the gameId for reference
    });

  } catch (error: unknown) { 
    console.error('Full error details:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      res.status(500).json({ 
        error: 'Failed to generate chat image', 
        details: error.response?.data || error.message 
      });
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error generating chat image: ${errorMessage}`);
      res.status(500).json({ error: 'Failed to generate chat image' });
    }
  }
};

// Optional: Retrieve game image
export const getGameImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const game = await Game.findByPk(gameId, {
      attributes: ['id', 'image_data']
    });

    if (!game || !game.image_data) {
      res.status(404).json({ error: 'Game or image not found' });
      return;
    }

    res.json({ 
      gameId: game.id, 
      imageUrl: game.image_data 
    });
  } catch (error) {
    console.error('Error retrieving game image:', error);
    res.status(500).json({ error: 'Failed to retrieve game image' });
  }
};

// Generate summary of the game,
// Generate text and image for the game
export const generateGameSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId, userId } = req.body;

    if (!gameId) {
      res.status(400).json({ error: 'Game ID is required' });
      return;
    }

    const game = await Game.findByPk(gameId);

    if (!game) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    // Generate a summary of the game
    const summary = `Game: ${game.title}
                  Description: ${game.description}
                  Genre: ${game.genre}
                  Subgenre: ${game.subgenre}
                  Created by: ${userId || 'Unknown'}
                  `;

    // Generate an image for the game
    const prompt = `Create an image for a game titled "${game.title}" with the following description: "${game.description}"`;
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MY_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the image URL from the response
    const imageUrl = openAiResponse.data.data[0].url;

    // Download the image
    const imageResponse = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    // Ensure the image directory exists
    const imageDir = path.join('public', 'images', 'game-images');
    await mkdirAsync(imageDir, { recursive: true });

    // Generate a unique filename
    const filename = `game-image-${Date.now()}.png`;
    const filepath = path.join(imageDir, filename);

    // Save the image to disk
    await writeFileAsync(filepath, imageResponse.data);

    // Create a relative URL for storing in the database
    const relativeImageUrl = `/images/game-images/${filename}`;

    res.json({ 
      summary,
      imageUrl: relativeImageUrl 
    }); 
  } catch (error: unknown) { 
    console.error('Full error details:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      res.status(500).json({ 
        error: 'Failed to generate game summary', 
        details: error.response?.data || error.message 
      });
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error generating game summary: ${errorMessage}`);
      res.status(500).json({ error: 'Failed to generate game summary' });
    }
  }
};
