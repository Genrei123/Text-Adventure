import { get_encoding, Tiktoken, TiktokenEncoding } from "tiktoken";
import User from "../model/user/user";

// Map of OpenAI models to their respective encodings using the proper type
const MODEL_TO_ENCODING: { [key: string]: TiktokenEncoding } = {
  'gpt-4': 'cl100k_base',
  'gpt-4-turbo': 'cl100k_base',
  'gpt-4o': 'o200k_base',
  'gpt-3.5-turbo': 'cl100k_base',
  'gpt-3.5-turbo-16k': 'cl100k_base',
  'text-davinci-003': 'p50k_base',
  'text-davinci-002': 'p50k_base',
  'text-curie-001': 'r50k_base',
  'text-babbage-001': 'r50k_base',
  'text-ada-001': 'r50k_base',
  'davinci': 'p50k_base',
  'curie': 'r50k_base',
  'babbage': 'r50k_base',
  'ada': 'r50k_base'
} as const;

// Cache for encoders to avoid recreating them
const encoderCache: { [key: string]: Tiktoken } = {};

// Get the appropriate encoder based on model name
function getEncoderForModel(model: string): Tiktoken {
  // Default to cl100k_base if model not found in the map
  const encodingName = MODEL_TO_ENCODING[model as keyof typeof MODEL_TO_ENCODING] || 'cl100k_base';
  
  // Use cached encoder if available
  if (!encoderCache[encodingName]) {
    try {
      // Now encodingName is properly typed as TiktokenEncoding
      encoderCache[encodingName] = get_encoding(encodingName);
    } catch (error) {
      console.error(`Failed to get encoding for ${encodingName}, falling back to cl100k_base`);
      encoderCache[encodingName] = get_encoding('cl100k_base');
    }
  }
  
  return encoderCache[encodingName];
}

// Get the user's model from the database
async function getUserModel(userId: number): Promise<string> {
  try {
    const user = await User.findByPk(userId);
    if (user && user.model) {
      return user.model; // Return the user's model from the database
    }
    return 'gpt-4'; // Default model if not found
  } catch (error) {
    console.error('Error fetching user model:', error);
    return 'gpt-4'; // Default model in case of error
  }
}

export async function getChatTokenDetails(messages: { role: string; content: string }[], userId?: number): Promise<number> {
  try {
    // Get the user's model if userId is provided
    const model = userId ? await getUserModel(userId) : 'gpt-4';
    
    // Get the encoder for the model
    const encoder = getEncoderForModel(model);
    
    let tokenCount = 0;
    
    for (const message of messages) {
      // Format the message as "role: content" which is how GPT models process it
      const formattedMessage = `${message.role}: ${message.content}`;
      tokenCount += encoder.encode(formattedMessage).length;
    }
    
    // Add additional tokens for API metadata
    // Different models have different overheads, but 3 tokens per message is a common value
    const perMessageOverhead = model.startsWith('gpt-4o') ? 3 : 3;
    tokenCount += messages.length * perMessageOverhead;
    
    return tokenCount;
  } catch (error) {
    console.error('Error in getChatTokenDetails:', error);
    
    // Fallback to a basic token estimation if everything fails
    let roughEstimate = 0;
    for (const message of messages) {
      // Roughly estimate 1.3 tokens per word as a fallback
      roughEstimate += (message.content.split(/\s+/).length * 1.3);
    }
    
    return Math.ceil(roughEstimate);
  }
}