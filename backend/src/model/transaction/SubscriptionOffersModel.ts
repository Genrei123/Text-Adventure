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
      defaultValue: 30, // Default duration of 30 days for monthly subscriptions
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
    timestamps: true,
    hooks: {
      afterSync: async () => {
        // This hook runs after table sync to populate default values if table is empty
        const count = await SubscriptionOffers.count();
        if (count === 0) {
          await SubscriptionOffers.bulkCreate([
            {
              offerId: "FREE",
              offerName: "Freedom Sword",
              description: "Begin your journey with 2000 tokens worth of free prompts and basic world access.",
              price: 0,
              duration: 0 // Free tier doesn't expire
            },
            {
              offerId: "SUB001",
              offerName: "Adventurer's Entry",
              description: "Gain extra tokens, extended prompt limits, and access to enhanced character options.",
              price: 100,
              duration: 30
            },
            {
              offerId: "SUB002",
              offerName: "Hero's Journey",
              description: "Enjoy unlimited prompts, customizable characters, ad-free storytelling, and access to exclusive worlds.",
              price: 250,
              duration: 30
            },
            {
              offerId: "SUB003",
              offerName: "Legend's Legacy",
              description: "Unlock ultimate features including early access to new worlds, personalized storylines, and priority support.",
              price: 500,
              duration: 30
            }
          ]);
        }
      }
    }
  }
);

export default SubscriptionOffers;