import { DataTypes, Model } from 'sequelize';
import sequelize from '../../service/database';

// Interface for the token package
export interface ITokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  bonus: number;
  currency: string;
  isPopular: boolean;
}

// Database model for token packages
class TokenPackage extends Model implements ITokenPackage {
  public id!: string;
  public name!: string;
  public tokens!: number;
  public price!: number;
  public bonus!: number;
  public currency!: string;
  public isPopular!: boolean;
}

TokenPackage.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokens: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  bonus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PHP',
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  sequelize,
  modelName: 'TokenPackage',
  tableName: 'Token_Packages',
  timestamps: true,
});

export default TokenPackage;