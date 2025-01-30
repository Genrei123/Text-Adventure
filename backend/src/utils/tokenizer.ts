import { get_encoding } from "tiktoken";

const enc = get_encoding("o200k_base"); // GPT-4o uses "o200k_base"

export function getChatTokenDetails(messages: { role: string; content: string }[]): number {
  if (!enc) {
    throw new Error("Encoder not initialized");
  }

  let tokenCount = 0;

  for (const message of messages) {
    const formattedMessage = `${message.role}${message.content}`;
    tokenCount += enc.encode(formattedMessage).length;
  }

  // Add additional tokens for API metadata (OpenAI adds 3 extra tokens per message)
  // See: https://platform.openai.com/docs/api-reference/chat/create
  // Remove this is not raw GPT-4o
  tokenCount += messages.length * 3;

  return tokenCount;
}
