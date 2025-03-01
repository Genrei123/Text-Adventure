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
const user_1 = __importDefault(require("../../model/user/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findAll();
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findByPk(id);
        });
    }
    static getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findOne({ where: { username } });
        });
    }
    static addUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for duplicate username
            const existingUserByUsername = yield user_1.default.findOne({ where: { username: userData.username } });
            if (existingUserByUsername) {
                throw new Error('Username already exists');
            }
            // Check for duplicate email
            const existingUserByEmail = yield user_1.default.findOne({ where: { email: userData.email } });
            if (existingUserByEmail) {
                throw new Error('Email already exists');
            }
            // Hash the password
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
            userData.password = hashedPassword;
            return yield user_1.default.create(userData);
        });
    }
    static updateUser(id, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findByPk(id);
                if (!user) {
                    throw new Error('User not found');
                }
                // Check for duplicate username if it's being updated
                if (updatedData.username && updatedData.username !== user.username) {
                    const existingUserByUsername = yield user_1.default.findOne({ where: { username: updatedData.username } });
                    if (existingUserByUsername) {
                        throw new Error('Username already exists');
                    }
                }
                // Check for duplicate email if it's being updated
                if (updatedData.email && updatedData.email !== user.email) {
                    const existingUserByEmail = yield user_1.default.findOne({ where: { email: updatedData.email } });
                    if (existingUserByEmail) {
                        throw new Error('Email already exists');
                    }
                }
                // Hash the password if it is being updated
                if (updatedData.password) {
                    updatedData.password = yield bcrypt_1.default.hash(updatedData.password, 10);
                }
                return yield user.update(updatedData);
            }
            catch (error) {
                throw new Error(`Failed to update user: ${error.message}`);
            }
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findByPk(id);
            if (user) {
                yield user.destroy();
                return true;
            }
            return false;
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=userService.js.map