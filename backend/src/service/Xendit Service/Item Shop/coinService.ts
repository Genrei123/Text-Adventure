import Order from '../../../model/order';
import { getTokenDetails } from '../../../utils/tokenizer';

// Fetch user's coin balance from the latest order
export async function getCoinBalance(userId: number): Promise<number> {
  const order = await Order.findOne({
    where: { UserId: userId },
    order: [['createdAt', 'DESC']],
    attributes: ['coins'],
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order.coins;
}

// Deduct coins based on token count from the latest order
export async function deductCoinsByTokens(userId: number, text: string): Promise<void> {
  // Fetch the latest order
  const order = await Order.findOne({
    where: { UserId: userId },
    order: [['createdAt', 'DESC']],
  });

  if (!order) {
    throw new Error('Order not found');
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

  if (order.coins < coinsToDeduct) {
    throw new Error('Insufficient coins');
  }

  // Deduct coins
  order.coins -= coinsToDeduct;
  await order.save();
}