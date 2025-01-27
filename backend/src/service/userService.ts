import User from '../model/user';
import bcrypt from 'bcrypt';

class UserService {
    static async getAllUsers() {
        return await User.findAll();
    }

    static async getUserById(id: number) {
        return await User.findByPk(id);
    }

    static async getUserByUsername(username: string) {
        return await User.findOne({ where: { username } });
    }

    static async addUser(userData: any) {
        // Check for duplicate username
        const existingUserByUsername = await User.findOne({ where: { username: userData.username } });
        if (existingUserByUsername) {
            throw new Error('Username already exists');
        }

        // Check for duplicate email
        const existingUserByEmail = await User.findOne({ where: { email: userData.email } });
        if (existingUserByEmail) {
            throw new Error('Email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        return await User.create(userData);
    }

    static async updateUser(id: number, updatedData: any) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }

            // Check for duplicate username if it's being updated
            if (updatedData.username && updatedData.username !== user.username) {
                const existingUserByUsername = await User.findOne({ where: { username: updatedData.username } });
                if (existingUserByUsername) {
                    throw new Error('Username already exists');
                }
            }

            // Check for duplicate email if it's being updated
            if (updatedData.email && updatedData.email !== user.email) {
                const existingUserByEmail = await User.findOne({ where: { email: updatedData.email } });
                if (existingUserByEmail) {
                    throw new Error('Email already exists');
                }
            }

            // Hash the password if it is being updated
            if (updatedData.password) {
                updatedData.password = await bcrypt.hash(updatedData.password, 10);
            }

            return await user.update(updatedData);
        } catch (error) {
            throw new Error(`Failed to update user: ${(error as Error).message}`);
        }
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

export default UserService;