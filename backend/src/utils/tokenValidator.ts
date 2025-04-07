import { getChatTokenDetails } from './tokenizer';

const MAX_INPUT_TOKENS = 50;
const MAX_OUTPUT_TOKENS = 150;
const TOKENS_PER_WEAVEL = 200;
const WEAVEL_COST = 1;

// Only used to check if input is within limits, not for deduction calculation
export const validateInputTokens = async (messages: any[]): Promise<{
  valid: boolean;
  tokenCount: number;
  message: string;
}> => {
  try {
    const tokenCount = await getChatTokenDetails(messages);
    
    if (tokenCount > MAX_INPUT_TOKENS) {
      return {
        valid: false,
        tokenCount,
        message: `Input exceeds the maximum allowed tokens (${MAX_INPUT_TOKENS})`
      };
    }
    
    return {
      valid: true,
      tokenCount,
      message: 'Input is within token limits'
    };
  } catch (error) {
    console.error('Error validating tokens:', error);
    return {
      valid: false,
      tokenCount: -1,
      message: 'Failed to validate tokens'
    };
  }
};

export const getTokenLimits = () => {
  return {
    maxInputTokens: MAX_INPUT_TOKENS,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    tokensPerWeavel: TOKENS_PER_WEAVEL,
    weavelCost: WEAVEL_COST
  };
};