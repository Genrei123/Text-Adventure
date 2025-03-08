import { Model, DataTypes } from 'sequelize';
import sequelize from '../../service/database';

class SubscriptionOffers extends Model {
  public offerId!: string;
  public offerName!: string;
  public description!: string;
  public price!: number;
  public duration!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

SubscriptionOffers.init(
  {
    offerId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    offerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'Subscription Offers',
    tableName: 'Subscription Offers',
    timestamps: true, // Enable automatic addition of createdAt and updatedAt columns
  }
);

export default SubscriptionOffers;