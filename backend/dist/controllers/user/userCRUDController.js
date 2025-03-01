"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRatingsByUsername = exports.getUserCommentsByUsername = exports.getUserRatingsById = exports.getUserCommentsById = exports.deleteUser = exports.updateUser = exports.addUser = exports.getUserByUsername = exports.getUserById = exports.getAllUsers = void 0;
const userService_1 = __importDefault(require("../../service/user/userService"));
const userGamesService_1 = require("../../service/user/userGamesService");
const getAllUsers = async (req, res) => {
    try {
        const users = await userService_1.default.getAllUsers();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const user = await userService_1.default.getUserById(parseInt(req.params.id));
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getUserById = getUserById;
const getUserByUsername = async (req, res) => {
    try {
        const user = await userService_1.default.getUserByUsername(req.params.username);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getUserByUsername = getUserByUsername;
const addUser = async (req, res) => {
    try {
        const addedUser = await userService_1.default.addUser(req.body);
        res.status(201).json(addedUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addUser = addUser;
const updateUser = async (req, res) => {
    try {
        const updatedUser = await userService_1.default.updateUser(parseInt(req.params.id), req.body);
        if (updatedUser) {
            res.json(updatedUser);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const deleted = await userService_1.default.deleteUser(parseInt(req.params.id));
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
const getUserCommentsById = async (req, res) => {
    try {
        const comments = await (0, userGamesService_1.getUserComments)(parseInt(req.params.id));
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user comments' });
    }
};
exports.getUserCommentsById = getUserCommentsById;
const getUserRatingsById = async (req, res) => {
    try {
        const ratings = await (0, userGamesService_1.getUserRatings)(parseInt(req.params.id));
        res.json(ratings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user ratings' });
    }
};
exports.getUserRatingsById = getUserRatingsById;
const getUserCommentsByUsername = async (req, res) => {
    try {
        const user = await userService_1.default.getUserByUsername(req.params.username);
        if (user) {
            const comments = await (0, userGamesService_1.getUserComments)(user.id);
            res.json(comments);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user comments' });
    }
};
exports.getUserCommentsByUsername = getUserCommentsByUsername;
const getUserRatingsByUsername = async (req, res) => {
    try {
        const user = await userService_1.default.getUserByUsername(req.params.username);
        if (user) {
            const ratings = await (0, userGamesService_1.getUserRatings)(user.id);
            res.json(ratings);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user ratings' });
    }
};
exports.getUserRatingsByUsername = getUserRatingsByUsername;
//# sourceMappingURL=userCRUDController.js.map