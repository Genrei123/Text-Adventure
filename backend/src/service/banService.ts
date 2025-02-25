import { Op } from 'sequelize';
import Ban from '../model/ban/ban';
import User from '../model/user/user';

export const createBan = async (banData: any) => {
    try {
        const user = await User.findByPk(banData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const ban = await Ban.create({
            ...banData,
            username: user.username // Add username field
        });
        console.log('Ban created successfully:', ban);
        return ban;
    } catch (error) {
        console.error('Error creating ban:', error);
        throw new Error('Error creating ban');
    }
};

// Other functions...