import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../service/database";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
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
  image_url?: string | null; // Add this field
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "emailVerified"
    | "resetPasswordToken"
    | "resetPasswordExpires"
    | "totalCoins"
    | "verificationToken"
    | "verificationTokenExpires"
    | "image_url" // Add image_url as optional for creation
  > {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
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
  public image_url?: string | null; // Add this field
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    private: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    model: { type: DataTypes.STRING, allowNull: false, defaultValue: "gpt-4" },
    admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    emailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
    totalCoins: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    verificationToken: { type: DataTypes.STRING, allowNull: true },
    verificationTokenExpires: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    image_url: { type: DataTypes.STRING, allowNull: true }, // Add this field to schema
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
  }
);

export default User;