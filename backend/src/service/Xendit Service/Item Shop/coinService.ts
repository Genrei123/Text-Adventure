import { QueryTypes } from 'sequelize';
import sequelize from '../../database';
import { IItem } from '../../../interfaces/itemInterface';
import Item from '../../../model/ItemModel';

interface UserCoins {
  coins: number;
}

// Fetch user's coin balance
export async function getCoinBalance(userId: number): Promise<number> {
  const query = `SELECT coins FROM User WHERE id = :userId`;
  const result = await sequelize.query<UserCoins>(query, {
    replacements: { userId },
    type: QueryTypes.SELECT,
  });
  return result[0].coins;
}

// Deduct coins based on word count
export async function deductCoinsByWords(userId: number, wordCount: number): Promise<void> {
  // Calculate the number of coins to deduct
  const coinsToDeduct = Math.ceil(wordCount / 4); // 4 words = 1 coin

  // Deduct coins only if the user has enough
  const query = `
    UPDATE Users
    SET coins = coins - :coinsToDeduct
    WHERE id = :userId AND coins >= :coinsToDeduct`;

  const result = await sequelize.query(query, {
    replacements: { coinsToDeduct, userId },
    type: QueryTypes.UPDATE,
  });

  if (result[1] === 0) {
    throw new Error('Insufficient coins');
  }
}

// Fetch item details based on item ID
export async function getItemDetails(itemId: string): Promise<IItem> {
  const item = await Item.findByPk(itemId);
  if (!item) {
    throw new Error('Item not found');
  }
  return item;
}