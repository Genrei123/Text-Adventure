import User from '../model/user';

class UserService {
    static async getAllUsers() {
        return await User.findAll();
    }

    static async getUserById(id: number) {
        return await User.findByPk(id);
    }

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

export default UserService;