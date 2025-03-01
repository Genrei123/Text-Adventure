import { Op } from 'sequelize';
import Ban from '../model/ban/ban';
import User from '../model/user/user';

/**
 * Creates a new ban for a user.
 * @param banData - The data for the new ban.
 * @returns The created ban.
 * @throws Error if the user is not found or if there is an error creating the ban.
 */
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

/**
 * Updates a ban with a comment.
 * @param id - The ID of the ban to update.
 * @param comment - The comment to add.
 * @throws Error if there is an error updating the ban.
 */
export const updateBan = async (id: number, comment: string) => {
    try {
        await Ban.update({ comment }, { where: { id } });
        console.log('Ban updated successfully');
    } catch (error) {
        console.error('Error updating ban:', error);
        throw new Error('Error updating ban');
    }
};

/**
 * Fetches all bans.
 * @returns A list of all bans.
 * @throws Error if there is an error fetching the bans.
 */
export const getAllBans = async () => {
    try {
        const bans = await Ban.findAll();
        return bans;
    } catch (error) {
        console.error('Error fetching bans:', error);
        throw new Error('Error fetching bans');
    }
};

/**
 * Fetches temporary bans.
 * @returns A list of temporary bans.
 * @throws Error if there is an error fetching the temporary bans.
 */
export const getTemporaryBans = async () => {
    try {
        const bans = await Ban.findAll({ where: { banType: 'temporary' } });
        return bans;
    } catch (error) {
        console.error('Error fetching temporary bans:', error);
        throw new Error('Error fetching temporary bans');
    }
};

/**
 * Fetches permanent bans.
 * @returns A list of permanent bans.
 * @throws Error if there is an error fetching the permanent bans.
 */
export const getPermanentBans = async () => {
    try {
        const bans = await Ban.findAll({ where: { banType: 'permanent' } });
        return bans;
    } catch (error) {
        console.error('Error fetching permanent bans:', error);
        throw new Error('Error fetching permanent bans');
    }
};

/**
 * Deletes a ban by ID.
 * @param id - The ID of the ban to delete.
 * @throws Error if there is an error deleting the ban.
 */
export const deleteBan = async (id: number) => {
    try {
        await Ban.destroy({ where: { id } });
        console.log('Ban deleted successfully');
    } catch (error) {
        console.error('Error deleting ban:', error);
        throw new Error('Error deleting ban');
    }
};

/**
 * Searches for users by username.
 * @param term - The search term.
 * @returns A list of users matching the search term.
 * @throws Error if there is an error searching for users.
 */
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