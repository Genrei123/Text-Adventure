import { Op } from 'sequelize';
import Ban from '../model/ban/ban';
import User from '../model/user/user';

export const createBan = async (banData: any) => {
    try {
        const ban = await Ban.create(banData);
        return ban;
    } catch (error) {
        console.error('Error creating ban:', error);
        throw new Error('Error creating ban');
    }
};

export const updateBan = async (id: number, comment: string) => {
    try {
        const ban = await Ban.findByPk(id);
        if (!ban) {
            throw new Error('Ban not found');
        }
        ban.comment = comment;
        await ban.save();
    } catch (error) {
        console.error('Error updating ban:', error);
        throw new Error('Error updating ban');
    }
};

export const getAllBans = async () => {
    try {
        const bans = await Ban.findAll({ include: [User] });
        return bans;
    } catch (error) {
        console.error('Error fetching bans:', error);
        throw new Error('Error fetching bans');
    }
};

export const getTemporaryBans = async () => {
    try {
        const bans = await Ban.findAll({
            where: { banType: 'temporary' },
            include: [User]
        });
        return bans;
    } catch (error) {
        console.error('Error fetching temporary bans:', error);
        throw new Error('Error fetching temporary bans');
    }
};

export const getPermanentBans = async () => {
    try {
        const bans = await Ban.findAll({
            where: { banType: 'permanent' },
            include: [User]
        });
        return bans;
    } catch (error) {
        console.error('Error fetching permanent bans:', error);
        throw new Error('Error fetching permanent bans');
    }
};

export const deleteBan = async (id: number) => {
    try {
        const ban = await Ban.findByPk(id);
        if (!ban) {
            throw new Error('Ban not found');
        }
        await ban.destroy();
    } catch (error) {
        console.error('Error deleting ban:', error);
        throw new Error('Error deleting ban');
    }
};

export const searchUsers = async (term: string) => {
    try {
        const users = await User.findAll({
            where: {
                username: {
                    [Op.iLike]: `%${term}%`
                }
            },
            attributes: ['id', 'username']
        });
        return users;
    } catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Error searching users');
    }
};