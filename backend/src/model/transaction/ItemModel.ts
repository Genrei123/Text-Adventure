import { DataTypes, Model } from 'sequelize';
import sequelize from '../../service/database';
import { IItem } from '../../interfaces/transaction/itemInterface';

// Database model for the Shop Item table
class Item extends Model implements IItem {
  public id!: string;
  public name!: string;
  public price!: number;
  public coins!: number;
}

Item.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  coins: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Added default value of 0 for coins
  },
}, {
  sequelize,
  modelName: 'Item',
  tableName: 'Shop Items',
  timestamps: false,
});

export default Item;