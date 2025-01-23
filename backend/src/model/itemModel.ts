import { DataTypes, Model } from 'sequelize';
import sequelize from '../service/database';
import { IItem } from '../interfaces/itemInterface';

class Item extends Model<IItem> implements IItem {
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
  },
}, {
  sequelize,
  modelName: 'Item',
  tableName: 'items',
  timestamps: false,
});

export default Item;