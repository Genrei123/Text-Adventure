"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../model/user/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    static async getAllUsers() {
        return await user_1.default.findAll();
    }
    static async getUserById(id) {
        return await user_1.default.findByPk(id);
    }
    static async getUserByUsername(username) {
        return await user_1.default.findOne({ where: { username } });
    }
    static async addUser(userData) {
        // Check for duplicate username
        const existingUserByUsername = await user_1.default.findOne({ where: { username: userData.username } });
        if (existingUserByUsername) {
            throw new Error('Username already exists');
        }
        // Check for duplicate email
        const existingUserByEmail = await user_1.default.findOne({ where: { email: userData.email } });
        if (existingUserByEmail) {
            throw new Error('Email already exists');
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        userData.password = hashedPassword;
        return await user_1.default.create(userData);
    }
    static async updateUser(id, updatedData) {
        try {
            const user = await user_1.default.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            // Check for duplicate username if it's being updated
            if (updatedData.username && updatedData.username !== user.username) {
                const existingUserByUsername = await user_1.default.findOne({ where: { username: updatedData.username } });
                if (existingUserByUsername) {
                    throw new Error('Username already exists');
                }
            }
            // Check for duplicate email if it's being updated
            if (updatedData.email && updatedData.email !== user.email) {
                const existingUserByEmail = await user_1.default.findOne({ where: { email: updatedData.email } });
                if (existingUserByEmail) {
                    throw new Error('Email already exists');
                }
            }
            // Hash the password if it is being updated
            if (updatedData.password) {
                updatedData.password = await bcrypt_1.default.hash(updatedData.password, 10);
            }
            return await user.update(updatedData);
        }
        catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }
    static async deleteUser(id) {
        const user = await user_1.default.findByPk(id);
        if (user) {
            await user.destroy();
            return true;
        }
        return false;
    }
}
exports.default = UserService;
//# sourceMappingURL=userService.js.map