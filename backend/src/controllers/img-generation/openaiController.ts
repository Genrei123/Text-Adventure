import { Request, Response } from 'express';
import axios from 'axios';
import Game from '../../model/game/game';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Function specifically for generating banner images
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
        model: 'dall-e-3', // Specify CLIP-DALL-E 4 model
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
      responseType: 'arraybuffer', // Ensure the response is treated as binary data
    });

    // Generate a unique filename
    const filename = `banner-image-${Date.now()}.png`;
    const filepath = path.join(imageDir, filename);

    // Save the image to disk
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

// For game cover images - updates the Game model
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
        model: 'dall-e-3', // Specify DALL-E 3 model
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
      responseType: 'arraybuffer', // Ensure the response is treated as binary data
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

// NEW: Function specifically for chat images - does NOT update Game model
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

    // Save the image to disk
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
