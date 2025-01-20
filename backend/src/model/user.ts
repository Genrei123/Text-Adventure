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
}

// Define the creation attributes for the User model
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Extend the Model class with the User attributes
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public private!: boolean;
    public model!: string;
    public admin!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
            defaultValue: "gpt-4",
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "User", // Optionally set the model name explicitly
    }
);

export default User;