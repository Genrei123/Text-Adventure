import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/sequelize';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  username: string;
  private: boolean;
  model: string;
  admin: boolean;
  emailVerified: boolean;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  totalCoins: number;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'emailVerified' | 'resetPasswordToken' | 'resetPasswordExpires' | 'totalCoins' | 'verificationToken' | 'verificationTokenExpires'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public username!: string;
  public private!: boolean;
  public model!: string;
  public admin!: boolean;
  public emailVerified!: boolean;
  public resetPasswordToken!: string | null;
  public resetPasswordExpires!: Date | null;
  public totalCoins!: number;
  public verificationToken!: string | null;
  public verificationTokenExpires!: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    private: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    model: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gpt-4' },
    admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    emailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
    totalCoins: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    verificationToken: { type: DataTypes.STRING, allowNull: true },
    verificationTokenExpires: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;