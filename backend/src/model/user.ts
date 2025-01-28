import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../service/database";

// Define the attributes of the User model
interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    private: boolean;
    model: string;
    admin: boolean;
    verificationCode: string | null;
    verificationCodeExpires: Date | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Define the creation attributes for the User model
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'verificationCode' | 'verificationCodeExpires' | 'emailVerified'> {}

// Extend the Model class with the User attributes
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public private!: boolean;
    public model!: string;
    public admin!: boolean;
    public verificationCode!: string | null;
    public verificationCodeExpires!: Date | null;
    public emailVerified!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        private: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'gpt-4',
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        verificationCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verificationCodeExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
        modelName: 'User',
    }
);

export default User;