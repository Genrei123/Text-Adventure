import { DataTypes, Model } from "sequelize";
import sequelize from "../service/database";

class User extends Model {
    static async addUser(userData: any) {
        return await User.create(userData);
    }

    static async updateUser(id: number, updatedData: any) {
        const user = await User.findByPk(id);
        if (user) {
            return await user.update(updatedData);
        }
        return null;
    }

    static async deleteUser(id: number) {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            return true;
        }
        return false;
    }
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