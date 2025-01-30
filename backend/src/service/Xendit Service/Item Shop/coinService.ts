import User from '../../../model/user';
import { getChatTokenDetails } from '../../../utils/tokenizer';

// Fetch user's coin balance
export async function getCoinBalance(userId: number): Promise<number> {
  const user = await User.findByPk(userId, {
     attributes: ['coins'],
  });

  if (!user) {
    throw new Error('User not found');
   }

  return user.totalCoins;
}

// Deduct coins based on token count
export async function deductCoinsByTokens(userId: number, text: string): Promise<void> {
  // Fetch the user
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Calculate the token count and get tokens
  let tokenCount;
  try {
    // Assuming the text is a single message
    const messages = [{ role: "user", content: text }];
    tokenCount = getChatTokenDetails(messages);
  } catch (error) {
    console.error('Error getting token details:', error);
    throw new Error('Failed to get token details');
  }

  const coinsToDeduct = tokenCount; // Assuming 1 coin per token

  if (user.totalCoins < coinsToDeduct) {
    throw new Error('Insufficient coins');
  }

  // Deduct coins
  user.totalCoins -= coinsToDeduct;
  await user.save();
}