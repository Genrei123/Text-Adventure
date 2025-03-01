"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRatingsByUsername = exports.getUserCommentsByUsername = exports.getUserRatingsById = exports.getUserCommentsById = exports.deleteUser = exports.updateUser = exports.addUser = exports.getUserByUsername = exports.getUserById = exports.getAllUsers = void 0;
const userService_1 = __importDefault(require("../../service/user/userService"));
const userGamesService_1 = require("../../service/user/userGamesService");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userService_1.default.getAllUsers();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService_1.default.getUserById(parseInt(req.params.id));
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
});
exports.getUserById = getUserById;
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService_1.default.getUserByUsername(req.params.username);
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
});
exports.getUserByUsername = getUserByUsername;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addedUser = yield userService_1.default.addUser(req.body);
        res.status(201).json(addedUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.addUser = addUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield userService_1.default.updateUser(parseInt(req.params.id), req.body);
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
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield userService_1.default.deleteUser(parseInt(req.params.id));
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
});
exports.deleteUser = deleteUser;
const getUserCommentsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield (0, userGamesService_1.getUserComments)(parseInt(req.params.id));
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user comments' });
    }
});
exports.getUserCommentsById = getUserCommentsById;
const getUserRatingsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ratings = yield (0, userGamesService_1.getUserRatings)(parseInt(req.params.id));
        res.json(ratings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user ratings' });
    }
});
exports.getUserRatingsById = getUserRatingsById;
const getUserCommentsByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService_1.default.getUserByUsername(req.params.username);
        if (user) {
            const comments = yield (0, userGamesService_1.getUserComments)(user.id);
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
});
exports.getUserCommentsByUsername = getUserCommentsByUsername;
const getUserRatingsByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService_1.default.getUserByUsername(req.params.username);
        if (user) {
            const ratings = yield (0, userGamesService_1.getUserRatings)(user.id);
            res.json(ratings);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user ratings' });
    }
});
exports.getUserRatingsByUsername = getUserRatingsByUsername;
//# sourceMappingURL=userCRUDController.js.map