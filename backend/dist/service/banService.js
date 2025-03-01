"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.deleteBan = exports.getPermanentBans = exports.getTemporaryBans = exports.getAllBans = exports.updateBan = exports.createBan = void 0;
const sequelize_1 = require("sequelize");
const ban_1 = __importDefault(require("../model/ban/ban"));
const user_1 = __importDefault(require("../model/user/user"));
/**
 * Creates a new ban for a user.
 * @param banData - The data for the new ban.
 * @returns The created ban.
 * @throws Error if the user is not found or if there is an error creating the ban.
 */
const createBan = async (banData) => {
    try {
        const user = await user_1.default.findByPk(banData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const ban = await ban_1.default.create({
            ...banData,
            username: user.username // Add username field
        });
        console.log('Ban created successfully:', ban);
        return ban;
    }
    catch (error) {
        console.error('Error creating ban:', error);
        throw new Error('Error creating ban');
    }
};
exports.createBan = createBan;
/**
 * Updates a ban with a comment.
 * @param id - The ID of the ban to update.
 * @param comment - The comment to add.
 * @throws Error if there is an error updating the ban.
 */
const updateBan = async (id, comment) => {
    try {
        await ban_1.default.update({ comment }, { where: { id } });
        console.log('Ban updated successfully');
    }
    catch (error) {
        console.error('Error updating ban:', error);
        throw new Error('Error updating ban');
    }
};
exports.updateBan = updateBan;
/**
 * Fetches all bans.
 * @returns A list of all bans.
 * @throws Error if there is an error fetching the bans.
 */
const getAllBans = async () => {
    try {
        const bans = await ban_1.default.findAll();
        return bans;
    }
    catch (error) {
        console.error('Error fetching bans:', error);
        throw new Error('Error fetching bans');
    }
};
exports.getAllBans = getAllBans;
/**
 * Fetches temporary bans.
 * @returns A list of temporary bans.
 * @throws Error if there is an error fetching the temporary bans.
 */
const getTemporaryBans = async () => {
    try {
        const bans = await ban_1.default.findAll({ where: { banType: 'temporary' } });
        return bans;
    }
    catch (error) {
        console.error('Error fetching temporary bans:', error);
        throw new Error('Error fetching temporary bans');
    }
};
exports.getTemporaryBans = getTemporaryBans;
/**
 * Fetches permanent bans.
 * @returns A list of permanent bans.
 * @throws Error if there is an error fetching the permanent bans.
 */
const getPermanentBans = async () => {
    try {
        const bans = await ban_1.default.findAll({ where: { banType: 'permanent' } });
        return bans;
    }
    catch (error) {
        console.error('Error fetching permanent bans:', error);
        throw new Error('Error fetching permanent bans');
    }
};
exports.getPermanentBans = getPermanentBans;
/**
 * Deletes a ban by ID.
 * @param id - The ID of the ban to delete.
 * @throws Error if there is an error deleting the ban.
 */
const deleteBan = async (id) => {
    try {
        await ban_1.default.destroy({ where: { id } });
        console.log('Ban deleted successfully');
    }
    catch (error) {
        console.error('Error deleting ban:', error);
        throw new Error('Error deleting ban');
    }
};
exports.deleteBan = deleteBan;
/**
 * Searches for users by username.
 * @param term - The search term.
 * @returns A list of users matching the search term.
 * @throws Error if there is an error searching for users.
 */
const searchUsers = async (term) => {
    try {
        const users = await user_1.default.findAll({
            where: {
                username: {
                    [sequelize_1.Op.iLike]: `%${term}%`
                }
            },
            attributes: ['id', 'username']
        });
        return users;
    }
    catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Error searching users');
    }
};
exports.searchUsers = searchUsers;
//# sourceMappingURL=banService.js.map