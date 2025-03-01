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
exports.addGame = exports.getGame = exports.getGames = void 0;
const game_1 = __importDefault(require("../../model/game/game"));
const getGames = () => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield game_1.default.findAll();
    return games;
});
exports.getGames = getGames;
const getGame = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield game_1.default.findByPk(id);
    return game;
});
exports.getGame = getGame;
const addGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield game_1.default.create({
        title: req.title,
        slug: req.slug,
        description: req.description,
        tagline: req.tagline,
        genre: req.genre,
        subgenre: req.subgenre,
        primary_color: req.primary_color,
        prompt_name: req.prompt_name,
        prompt_text: req.prompt_text,
        prompt_model: req.prompt_model,
        image_prompt_model: req.image_prompt_model,
        image_prompt_name: req.image_prompt_name,
        image_prompt_text: req.image_prompt_text,
        image_data: req.image_data,
        music_prompt_text: req.music_prompt_text,
        music_prompt_seed_image: req.music_prompt_seed_image,
        private: req.private,
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: req.UserId,
    });
    return game;
});
exports.addGame = addGame;
//# sourceMappingURL=gameService.js.map