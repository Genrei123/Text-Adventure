import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../service/database';
import Player from './player';

interface BanAttributes {
  id: string;
  player_id: string;
  reason: string;
  ban_type: 'permanent' | 'temporary';
  unban_date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface BanCreationAttributes extends Optional<BanAttributes, 'id'> {}

class Ban extends Model<BanAttributes, BanCreationAttributes> implements BanAttributes {
  public id!: string;
  public player_id!: string;
  public reason!: string;
  public ban_type!: 'permanent' | 'temporary';
  public unban_date?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Ban.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    player_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Player,
        key: 'id',
      },
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ban_type: {
      type: DataTypes.ENUM('permanent', 'temporary'),
      allowNull: false,
    },
    unban_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Ban',
  }
);

export default Ban;