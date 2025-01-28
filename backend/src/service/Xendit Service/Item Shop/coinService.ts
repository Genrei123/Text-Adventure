import User from '../../../model/user';
import { IItem } from '../../../interfaces/itemInterface';
import Item from '../../../model/ItemModel';

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
export async function deductCoinsByTokens(userId: number, coinsToDeduct: number): Promise<void> {
  // Fetch the user
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.coins < coinsToDeduct) {
    throw new Error('Insufficient coins');
  }

  // Deduct the coins
  user.coins -= coinsToDeduct;
  await user.save();
}

// Fetch item details based on item ID
export async function getItemDetails(itemId: string): Promise<IItem> {
  const item = await Item.findByPk(itemId);
  if (!item) {
    throw new Error('Item not found');
  }
  return item;
}