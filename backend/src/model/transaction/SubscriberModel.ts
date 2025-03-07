import { DataTypes, Model } from 'sequelize';
import sequelize from '../../service/database';
import { ISubscriber } from '../../interfaces/transaction/subscriberInterface';

// Database model for the Subscriber table
class Subscriber extends Model<ISubscriber> implements ISubscriber {
  public id!: string;
  public email!: string;
  public subscribedAt!: Date;
  public startDate!: Date; // Not nullable
  public endDate!: Date; // Allow null values
  public subscriptionType!: string;
  public status!: string;
  public duration!: number;
}

Subscriber.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  subscribedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false, // Not nullable
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true, // Allow null values
  },
  subscriptionType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Subscriber',
  tableName: 'Subscribers',
  timestamps: false,
});

export default Subscriber;