import { Request, Response } from 'express';
import { Location, Item } from '../../../../interfaces/game/nih-game/nih-game';
import {
  findOrCreateSession,
  callOpenAI,
  storeChatMessage,
  getConversationHistory,
  validateUserAndGame,
  resetConversationHistory, // New function to add in chatService
} from '../../../../service/chat/chatService';
import { Json } from 'xendit-node';
import User from "../../../../model/user/user";

// Define interfaces (if not already in your imported file)
interface PlayerState {
  locationId: string;
  inventory: Item[];
  moveCount: number; // Track number of moves
  gameStartTime: number; // Track when game started
  gameCompleted: boolean; // Track if game is completed
}

// In-memory game state (replace with database in production)
const gameState: { [playerId: string]: PlayerState } = {
  "player1": {
    locationId: "village",
    inventory: [
      { id: "key1", name: "Rusty Key", description: "An old key that might unlock something.", usableOn: ["door"] }
    ],
    moveCount: 0,
    gameStartTime: Date.now(),
    gameCompleted: false
  }
};

// Mock locations
const locations: { [id: string]: Location } = {
  // ... existing locations remain the same
  village: {
    id: "village",
    name: "Small Village",
    description: "A quiet village with a few modest homes. An unsettling feeling hangs in the air, as if something is amiss.",
    exits: { north: "trapped_room" },
    events: ["Villagers warn about the abandoned mansion", "Strange sounds in the distance"],
    interactables: [],
  },
  trapped_room: {
    id: "trapped_room",
    name: "Abandoned Room",
    description: "A dark, decrepit room with shattered furniture. The door is locked shut, preventing any escape.",
    exits: { north: "endless_hallway", south: "village" },
    events: ["Simoun introduces himself", "Room starts crumbling"],
    interactables: ["door"],
  },
  endless_hallway: {
    id: "endless_hallway",
    name: "Endless Hallway",
    description: "An eerie corridor stretching far beyond sight. The air is heavy, and an unsettling presence lingers.",
    exits: { forward: "kitchen", back: "trapped_room" },
    events: ["The hallway shifts", "The spirit appears and attacks"],
    interactables: [],
  },
};

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// New helper function to initialize or reset player state
const resetPlayerState = (playerKey: string): void => {
  gameState[playerKey] = {
    locationId: "village",
    inventory: [
      { id: "key1", name: "Rusty Key", description: "An old key that might unlock something.", usableOn: ["door"] }
    ],
    moveCount: 0,
    gameStartTime: Date.now(),
    gameCompleted: false
  };
};

// New endpoint to start/reset game
export const startNewGame = async (req: Request, res: Response): Promise<Json> => {
  try {
    const playerId = parseInt(req.params.playerId || "1", 10);
    const gameId = parseInt(req.params.gameId || "1", 10);

    // Validate user and game
    await validateUserAndGame(playerId, gameId);

    const playerKey = `player${playerId}`;
    
    // Reset player state
    resetPlayerState(playerKey);
    
    // Reset conversation history
    const sessionId = await findOrCreateSession(playerId, gameId);
    await resetConversationHistory(sessionId, playerId, gameId);
    
    // Get current location for initial narration
    const currentLocation = locations[gameState[playerKey].locationId];
    
    // Prepare initial system message
    const initialPrompt: ChatMessage[] = [
      {
        role: "system",
        content: `Welcome to the game. You are in ${currentLocation.name}: ${currentLocation.description}. You have a total of 30 moves to complete your adventure. Your journey begins now.`
      }
    ];
    
    const user = await User.findByPk(playerId);
    if (!user) {
      throw new Error("User not found.");
    }
    
    const model = user.model || "gpt-3.5-turbo";
    
    // Call OpenAI for initial narration
    const narration = await callOpenAI(playerId, initialPrompt);
    await storeChatMessage(sessionId, playerId, gameId, "assistant", narration.content, model, undefined, narration.roleplay_metadata);
    
    res.status(200).json({
      message: "New game started successfully",
      location: {
        id: currentLocation.id,
        name: currentLocation.name,
        description: currentLocation.description,
        exits: currentLocation.exits
      },
      narration,
      moveCount: 0,
      maxMoves: 30
    });
  } catch (error) {
    console.error("Error in startNewGame:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// New endpoint to end game early
export const endGameEarly = async (req: Request, res: Response): Promise<Json> => {
  try {
    const playerId = parseInt(req.params.playerId || "1", 10);
    const gameId = parseInt(req.params.gameId || "1", 10);

    // Validate user and game
    await validateUserAndGame(playerId, gameId);

    const playerKey = `player${playerId}`;
    
    // Check if player exists
    if (!gameState[playerKey]) {
      return res.status(404).json({ message: "Player not found" });
    }
    
    // Mark game as completed
    gameState[playerKey].gameCompleted = true;
    
    // Calculate game duration
    const gameDuration = Math.floor((Date.now() - gameState[playerKey].gameStartTime) / 1000);
    
    // Get session for final narration
    const sessionId = await findOrCreateSession(playerId, gameId);
    const history: ChatMessage[] = await getConversationHistory(sessionId, playerId, gameId);
    
    // Prepare prompt for final narration
    const prompt: ChatMessage[] = [
      ...history,
      {
        role: "system",
        content: `The player has chosen to end the game early after ${gameState[playerKey].moveCount} moves. Create a brief summary of their adventure, mentioning locations they visited and key actions they took.`
      }
    ];
    
    const user = await User.findByPk(playerId);
    if (!user) {
      throw new Error("User not found.");
    }
    
    const model = user.model || "gpt-3.5-turbo";
    
    // Call OpenAI for final narration
    const narration = await callOpenAI(playerId, prompt);
    await storeChatMessage(sessionId, playerId, gameId, "assistant", narration.content, model, undefined, narration.roleplay_metadata);
    
    res.status(200).json({
      message: "Game ended successfully",
      summary: narration.content,
      moveCount: gameState[playerKey].moveCount,
      gameDuration: gameDuration
    });
  } catch (error) {
    console.error("Error in endGameEarly:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Modified changeLocation function to track moves
export const changeLocation = async (req: Request, res: Response): Promise<Json> => {
  try {
    const playerId = parseInt(req.params.playerId || "1", 10);
    const gameId = parseInt(req.params.gameId || "1", 10);
    const { direction } = req.body;

    // Validate user and game
    await validateUserAndGame(playerId, gameId);

    if (!direction || typeof direction !== "string") {
      return res.status(400).json({ message: "Direction is required" });
    }

    // Check if player exists
    const playerKey = `player${playerId}`;
    if (!gameState[playerKey]) {
      resetPlayerState(playerKey);
    }
    
    // Check if game is already completed
    if (gameState[playerKey].gameCompleted) {
      return res.status(400).json({ message: "Game already completed. Start a new game." });
    }
    
    // Check if move limit reached
    if (gameState[playerKey].moveCount >= 30) {
      return res.status(400).json({ message: "Move limit reached. Game over." });
    }

    // Get current location
    const currentLocationId = gameState[playerKey].locationId;
    const currentLocation = locations[currentLocationId];

    if (!currentLocation) {
      return res.status(500).json({ message: "Current location not found" });
    }

    // Check if the direction is valid
    const newLocationId = currentLocation.exits[direction.toLowerCase()];
    if (!newLocationId || !locations[newLocationId]) {
      return res.status(400).json({ message: `Cannot move ${direction} from here` });
    }

    // Update player's location and increment move count
    gameState[playerKey].locationId = newLocationId;
    gameState[playerKey].moveCount++;
    const moveCount = gameState[playerKey].moveCount;
    const newLocation = locations[newLocationId];

    // Get or create session
    const sessionId = await findOrCreateSession(playerId, gameId);

    // Get conversation history for context
    const history: ChatMessage[] = await getConversationHistory(sessionId, playerId, gameId);

    // Prepare prompt for AI narrator
    const prompt: ChatMessage[] = [
      ...history,
      {
        role: "system",
        content: `The player is in a game world. They move ${direction} from ${currentLocation.name} to ${newLocation.name}. This is move ${moveCount} out of 30. Their inventory includes: ${gameState[playerKey].inventory.map(i => i.name).join(", ") || "nothing"}. Describe the new location and what happens next in an engaging, narrative style.`
      }
    ];

    const user = await User.findByPk(playerId);
    if (!user) {
      throw new Error("User not found.");
    }

    const model = user.model || "gpt-3.5-turbo";

    // Call OpenAI for narration
    const narration = await callOpenAI(playerId, prompt);
    await storeChatMessage(sessionId, playerId, gameId, "assistant", narration.content, model, undefined, narration.roleplay_metadata);

    // Check if this was the final move
    let gameCompleted = false;
    let gameSummary = "Create a summary of abandoned house game";
    
    if (moveCount >= 30) {
      gameState[playerKey].gameCompleted = true;
      gameCompleted = true;
      
      // Prepare prompt for game summary
      const summaryPrompt: ChatMessage[] = [
        ...history,
        {
          role: "system",
          content: `The player has reached the maximum of 30 moves. Create a summary of their entire adventure, mentioning locations they visited and key actions they took.`
        }
      ];
      
      // Call OpenAI for game summary
      const summaryResponse = await callOpenAI(playerId, summaryPrompt);
      gameSummary = summaryResponse.content;
      await storeChatMessage(sessionId, playerId, gameId, "assistant", gameSummary, model, undefined, summaryResponse.roleplay_metadata);
    }

    // Respond with the new location, narration, and move count
    res.status(200).json({
      message: "Location changed successfully",
      location: {
        id: newLocation.id,
        name: newLocation.name,
        description: newLocation.description,
        exits: newLocation.exits
      },
      narration,
      moveCount,
      movesLeft: 30 - moveCount,
      gameCompleted,
      gameSummary
    });
  } catch (error) {
    console.error("Error in changeLocation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Modified useItem function to track moves
export const useItem = async (req: Request, res: Response): Promise<Json> => {
  try {
    const playerId = parseInt(req.params.playerId || "1", 10);
    const gameId = parseInt(req.params.gameId || "1", 10);
    const { itemId, target } = req.body;

    // Validate user and game
    await validateUserAndGame(playerId, gameId);

    if (!itemId || typeof itemId !== "string") {
      return res.status(400).json({ message: "Item ID is required" });
    }

    // Check if player exists
    const playerKey = `player${playerId}`;
    if (!gameState[playerKey]) {
      return res.status(404).json({ message: "Player not found" });
    }
    
    // Check if game is already completed
    if (gameState[playerKey].gameCompleted) {
      return res.status(400).json({ message: "Game already completed. Start a new game." });
    }
    
    // Check if move limit reached
    if (gameState[playerKey].moveCount >= 30) {
      return res.status(400).json({ message: "Move limit reached. Game over." });
    }

    // Get player's inventory and current location
    const inventory = gameState[playerKey].inventory;
    const currentLocationId = gameState[playerKey].locationId;
    const currentLocation = locations[currentLocationId];

    // Find the item in inventory
    const itemIndex = inventory.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) {
      return res.status(400).json({ message: "Item not found in inventory" });
    }
    const item = inventory[itemIndex];

    // Validate item usage based on location
    let resultMessage = `${item.name} was used.`;
    if (target) {
      // Check if the target is valid in the current location
      if (!currentLocation.interactables || !currentLocation.interactables.includes(target)) {
        return res.status(400).json({ message: `There is no ${target} here to use ${item.name} on.` });
      }

      // Check if the item can be used on the target
      if (item.usableOn && item.usableOn.includes(target)) {
        resultMessage = `${item.name} was used on ${target} successfully.`;
        inventory.splice(itemIndex, 1); // Remove item after use
      } else {
        return res.status(400).json({ message: `${item.name} cannot be used on ${target}` });
      }
    } else {
      return res.status(400).json({ message: "A target is required to use this item." });
    }

    // Increment move count
    gameState[playerKey].moveCount++;
    const moveCount = gameState[playerKey].moveCount;

    // Get or create session
    const sessionId = await findOrCreateSession(playerId, gameId);

    // Get conversation history for context
    const history: ChatMessage[] = await getConversationHistory(sessionId, playerId, gameId);

    // Prepare prompt for AI narrator
    const prompt: ChatMessage[] = [
      ...history,
      {
        role: "system",
        content: `The player is in ${currentLocation.name} with inventory: ${inventory.map(i => i.name).join(", ") || "nothing"}. This is move ${moveCount} out of 30. They use ${item.name} on ${target}. Describe what happens next in an engaging, narrative style.`
      }
    ];

    const user = await User.findByPk(playerId);
    if (!user) {
      throw new Error("User not found.");
    }

    const model = user.model || "gpt-3.5-turbo";

    // Call OpenAI for narration
    const narration = await callOpenAI(playerId, prompt);
    await storeChatMessage(sessionId, playerId, gameId, "assistant", narration.content, model, undefined, narration.roleplay_metadata);

    // Check if this was the final move
    let gameCompleted = false;
    let gameSummary = "Generate a summary";
    
    if (moveCount >= 30) {
      gameState[playerKey].gameCompleted = true;
      gameCompleted = true;
      
      // Prepare prompt for game summary
      const summaryPrompt: ChatMessage[] = [
        ...history,
        {
          role: "system",
          content: `The player has reached the maximum of 30 moves. Create a summary of their entire adventure, mentioning locations they visited and key actions they took.`
        }
      ];
      
      // Call OpenAI for game summary
      const summaryResponse = await callOpenAI(playerId, summaryPrompt);
      gameSummary = summaryResponse.content;
      await storeChatMessage(sessionId, playerId, gameId, "assistant", gameSummary, model, undefined, summaryResponse.roleplay_metadata);
    }

    // Respond with the result
    res.status(200).json({
      message: resultMessage,
      inventory: gameState[playerKey].inventory,
      narration,
      moveCount,
      movesLeft: 30 - moveCount,
      gameCompleted,
      gameSummary
    });
  } catch (error) {
    console.error("Error in useItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// The other functions (getInventory, getGameState) remain mostly the same but update to include move count
export const getInventory = async (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerId || "1", 10);
    const gameId = parseInt(req.params.gameId || "1", 10);
    console.log(`Fetching for playerId: ${playerId}, gameId: ${gameId}`);

    // Validate user and game
    await validateUserAndGame(playerId, gameId);

    const playerKey = `player${playerId}`;
    
    // Check if the player exists in string format (for backward compatibility)
    if (!gameState[playerKey] && gameState["player1"] && playerId === 1) {
      // Copy the existing player1 state to ensure we use the right format
      gameState[playerKey] = { ...gameState["player1"] };
    }
    
    // Initialize player state if not exists with the default rusty key
    if (!gameState[playerKey]) {
      console.log(`Initializing state for ${playerKey}`);
      resetPlayerState(playerKey);
    }
    
    // Make sure the player has the rusty key if inventory is empty
    if (gameState[playerKey].inventory.length === 0) {
      gameState[playerKey].inventory.push(
        { id: "key1", name: "Rusty Key", description: "An old key that might unlock something.", usableOn: ["door"] }
      );
    }

    const inventory = gameState[playerKey].inventory;
    console.log('Inventory:', inventory);

    res.status(200).json({
      message: "Inventory retrieved successfully",
      inventory,
      moveCount: gameState[playerKey].moveCount,
      movesLeft: 30 - gameState[playerKey].moveCount,
      gameCompleted: gameState[playerKey].gameCompleted
    });
  } catch (error: unknown) {
    console.error("Error in getInventory:", error instanceof Error ? `${error.message} ${error.stack}` : error);
    res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getGameState = async (req: Request, res: Response): Promise<Json> => {
  try {
    const playerId = parseInt(req.params.playerId || "1", 10);
    const gameId = parseInt(req.params.gameId || "1", 10);
    
    // Validate user and game
    await validateUserAndGame(playerId, gameId);
    
    const playerKey = `player${playerId}`;
    
    // Check if player exists in game state
    if (!gameState[playerKey]) {
      // Initialize player if they don't exist
      resetPlayerState(playerKey);
    }
    
    const playerState = gameState[playerKey];
    const currentLocationId = playerState.locationId;
    
    // Get location details (will be null if location doesn't exist)
    const locationDetails = locations[currentLocationId] || {
      id: currentLocationId,
      name: "Unknown Location",
      description: "This location doesn't exist in the game world.",
      exits: {},
      events: []
    };
    
    // Prepare response with detailed state information
    res.status(200).json({
      message: "Game state retrieved successfully",
      player: {
        id: playerId,
        gameId: gameId
      },
      state: {
        locationId: currentLocationId,
        locationValid: !!locations[currentLocationId],
        locationDetails: locationDetails,
        inventory: playerState.inventory,
        inventoryCount: playerState.inventory.length,
        moveCount: playerState.moveCount,
        movesLeft: 30 - playerState.moveCount,
        gameCompleted: playerState.gameCompleted
      },
      availableLocations: Object.keys(locations),
      debug: {
        currentStateEntry: JSON.stringify(playerState)
      }
    });
  } catch (error) {
    console.error("Error in getGameState:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};