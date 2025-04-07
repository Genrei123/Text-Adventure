import User from '../../../model/user/user';
import { getChatTokenDetails } from '../../../utils/tokenizer';
import Order from '../../../model/transaction/order'; // Import the Order model

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
// Deduct exactly one Weavel (coin) per interaction
export async function deductCoinsByTokens(userId: number, type: string = "interaction"): Promise<number> {
  // Fetch the user
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // SAGE Weavel system: Fixed cost of 1 Weavel per interaction
  const WEAVEL_COST = 1;
  
  if (user.totalCoins < WEAVEL_COST) {
    throw new Error('Insufficient Weavels');
  }

  // Deduct exactly 1 Weavel
  user.totalCoins -= WEAVEL_COST;
  await user.save();
  
  console.log(`Deducted 1 Weavel from user ${userId} for ${type}. Remaining: ${user.totalCoins}`);
  
  return WEAVEL_COST; // Return how many coins were deducted
}

export async function checkOrderIdExists(order_id: string): Promise<boolean> {
  const order = await Order.findOne({ where: { order_id } });
  return !!order; // Return true if order exists, false otherwise
}