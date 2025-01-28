import User from '../../../model/user';
import { getTokenDetails } from '../../../utils/tokenizer';

// Fetch user's coin balance
export async function getCoinBalance(userId: number): Promise<number> {
  const user = await User.findByPk(userId, {
    attributes: ['coins'],
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.coins;
}

// Deduct coins based on token count
export async function deductCoinsByTokens(userId: number, text: string): Promise<void> {
  // Fetch the user
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Calculate the token count and get tokens
  let tokenDetails;
  try {
    tokenDetails = getTokenDetails(text);
  } catch (error) {
    console.error('Error getting token details:', error);
    throw new Error('Failed to get token details');
  }

  const { tokenCount, tokens } = tokenDetails;
  const coinsToDeduct = tokenCount; // Assuming 1 coin per token

  if (user.coins < coinsToDeduct) {
    throw new Error('Insufficient coins');
  }

  // Deduct coins
  user.coins -= coinsToDeduct;
  await user.save();
}