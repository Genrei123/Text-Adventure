"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userCRUDController_1 = require("../../controllers/user/userCRUDController");
const router = express_1.default.Router();
router.get('/users', userCRUDController_1.getAllUsers);
router.get('/users/:id', userCRUDController_1.getUserById);
router.get('/users/username/:username', userCRUDController_1.getUserByUsername);
router.post('/users', userCRUDController_1.addUser);
router.put('/users/:id', userCRUDController_1.updateUser);
router.delete('/users/:id', userCRUDController_1.deleteUser);
router.get('/users/:id/comments', userCRUDController_1.getUserCommentsById);
router.get('/users/:id/ratings', userCRUDController_1.getUserRatingsById);
router.get('/users/username/:username/comments', userCRUDController_1.getUserCommentsByUsername);
router.get('/users/username/:username/ratings', userCRUDController_1.getUserRatingsByUsername);
exports.default = router;
//# sourceMappingURL=userCRUDRoutes.js.map