import { encoding_for_model } from 'tiktoken';

let enc: any;

try {
  enc = encoding_for_model('gpt-4o');
} catch (error) {
  console.error('Error initializing encoder:', error);
}

export function getTokenDetails(text: string): { tokenCount: number, tokens: number[] } {
  if (!enc) {
    throw new Error('Encoder not initialized');
  }
  const tokens = Array.from(enc.encode(text)) as number[]; // Convert Uint32Array to number[]
  const tokenCount = tokens.length;
  return { tokenCount, tokens };
}