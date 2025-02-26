import { Request, Response } from 'express';
import { Location, Item } from '../../../../interfaces/game/nih-game/nih-game';
import {
  findOrCreateSession,
  callOpenAI,
  storeChatMessage,
  getConversationHistory,
  validateUserAndGame,
} from '../../../../service/chat/chatService'; // Adjust path to your service file
import { Json } from 'xendit-node';

// Define interfaces (if not already in your imported file)
interface PlayerState {
  locationId: string;
  inventory: Item[];
}

// In-memory game state (replace with database in production)
const gameState: { [playerId: string]: PlayerState } = {
  "player1": {
    locationId: "village",
    inventory: [
      { id: "key1", name: "Rusty Key", description: "An old key that might unlock something.", usableOn: ["door"] }
    ]
  }
};

// Mock locations (replace with database or config file)
const locations: { [id: string]: Location } = {
  village: {
    id: "village",
    name: "Small Village",
    description: "A quiet village with a few modest homes. An unsettling feeling hangs in the air, as if something is amiss.",
    exits: { north: "trapped_room" },
    events: ["Villagers warn about the abandoned mansion", "Strange sounds in the distance"],
  },
  trapped_room: {
    id: "trapped_room",
    name: "Abandoned Room",
    description: "A dark, decrepit room with shattered furniture. The door is locked shut, preventing any escape.",
    exits: { north: "endless_hallway", south: "village" },
    events: ["Simoun introduces himself", "Room starts crumbling"],
  },
  endless_hallway: {
    id: "endless_hallway",
    name: "Endless Hallway",
    description: "An eerie corridor stretching far beyond sight. The air is heavy, and an unsettling presence lingers.",
    exits: { forward: "kitchen", back: "trapped_room" },
    events: ["The hallway shifts", "The spirit appears and attacks"],
  },
  kitchen: {
    id: "kitchen",
    name: "Cursed Kitchen",
    description: "A dimly lit kitchen bathed in moonlight, yet an unbearable heat fills the air.",
    exits: { east: "endless_hallway", south: "blood_flooded_chamber" },
    events: ["Simoun helps find the key", "The blood curse activates"],
  },
  blood_flooded_chamber: {
    id: "blood_flooded_chamber",
    name: "Blood-Filled Chamber",
    description: "A vast room drowning in thick, crimson liquid. The walls are lined with lifeless husks.",
    exits: { down: "wraith_sanctuary" },
    events: ["Simoun attacks", "Kalen collapses from horror"],
  },
  wraith_sanctuary: {
    id: "wraith_sanctuary",
    name: "Wraith's Lair",
    description: "A cursed sanctum where the tormented wraith reveals its true, horrifying form.",
    exits: { portal: "real_world" },
    events: ["Nih possesses Kalen", "The gate to the real world opens"],
  },
  real_world: {
    id: "real_world",
    name: "The Real World",
    description: "A sudden return to reality... but has the nightmare truly ended?",
    exits: {},
    events: ["To be continued..."],
  },
};


// Define ChatMessage type locally to match your service (or import it if exposed)
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Controller functions
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

    // Check if player exists (temporary in-memory check)
    if (!gameState[`player${playerId}`]) {
      gameState[`player${playerId}`] = { locationId: "village", inventory: [] }; // Initialize if not exists
    }

    // Get current location
    const currentLocationId = gameState[`player${playerId}`].locationId;
    const currentLocation = locations[currentLocationId];

    if (!currentLocation) {
      return res.status(500).json({ message: "Current location not found" });
    }

    // Check if the direction is valid
    const newLocationId = currentLocation.exits[direction.toLowerCase()];
    if (!newLocationId || !locations[newLocationId]) {
      return res.status(400).json({ message: `Cannot move ${direction} from here` });
    }

    // Update player's location
    gameState[`player${playerId}`].locationId = newLocationId;
    const newLocation = locations[newLocationId];

    // Get or create session
    const sessionId = await findOrCreateSession(playerId, gameId);

    // Get conversation history for context
    const history: ChatMessage[] = await getConversationHistory(sessionId, playerId, gameId);

    // Prepare prompt for AI narrator with explicit ChatMessage type
    const prompt: ChatMessage[] = [
      ...history,
      {
        role: "system", // Explicitly set as "system"
        content: `The player is in a game world. They move ${direction} from ${currentLocation.name} to ${newLocation.name}. Their inventory includes: ${gameState[`player${playerId}`].inventory.map(i => i.name).join(", ") || "nothing"}. Describe the new location and what happens next in an engaging, narrative style.`
      }
    ];

    // Call OpenAI for narration
    const narration = await callOpenAI(prompt);
    await storeChatMessage(sessionId, playerId, gameId, "assistant", narration);

    // Respond with the new location and narration
    res.status(200).json({
      message: "Location changed successfully",
      location: {
        id: newLocation.id,
        name: newLocation.name,
        description: newLocation.description,
        exits: newLocation.exits
      },
      narration
    });
  } catch (error) {
    console.error("Error in changeLocation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    if (!gameState[`player${playerId}`]) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Get player's inventory and current location
    const inventory = gameState[`player${playerId}`].inventory;
    const currentLocationId = gameState[`player${playerId}`].locationId;
    const currentLocation = locations[currentLocationId];

    // Find the item in inventory
    const itemIndex = inventory.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) {
      return res.status(400).json({ message: "Item not found in inventory" });
    }
    const item = inventory[itemIndex];

    // Basic item usage logic
    let resultMessage = `${item.name} was used.`;
    if (target) {
      if (item.usableOn && item.usableOn.includes(target)) {
        resultMessage = `${item.name} was used on ${target} successfully.`;
        inventory.splice(itemIndex, 1); // Remove item after use
      } else {
        return res.status(400).json({ message: `${item.name} cannot be used on ${target}` });
      }
    }

    // Get or create session
    const sessionId = await findOrCreateSession(playerId, gameId);

    // Get conversation history for context
    const history: ChatMessage[] = await getConversationHistory(sessionId, playerId, gameId);

    // Prepare prompt for AI narrator with explicit ChatMessage type
    const prompt: ChatMessage[] = [
      ...history,
      {
        role: "system", // Explicitly set as "system"
        content: `The player is in ${currentLocation.name} with inventory: ${inventory.map(i => i.name).join(", ") || "nothing"}. They use ${item.name}${target ? ` on ${target}` : ""}. Describe what happens next in an engaging, narrative style.`
      }
    ];

    // Call OpenAI for narration
    const narration = await callOpenAI(prompt);
    await storeChatMessage(sessionId, playerId, gameId, "assistant", narration);

    // Respond with the result
    res.status(200).json({
      message: resultMessage,
      inventory: gameState[`player${playerId}`].inventory,
      narration
    });
  } catch (error) {
    console.error("Error in useItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
      gameState[playerKey] = {
        locationId: "village",
        inventory: [
          { id: "key1", name: "Rusty Key", description: "An old key that might unlock something.", usableOn: ["door"] }
        ]
      };
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
      inventory
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
      
      // Reference to the global gameState and locations objects
      // Make sure these are accessible in this scope
      const playerKey = `player${playerId}`;
      
      // Check if player exists in game state
      if (!gameState[playerKey]) {
        // Initialize player if they don't exist
        gameState[playerKey] = {
          locationId: "village", // This will still be invalid until fixed
          inventory: []
        };
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
          inventoryCount: playerState.inventory.length
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