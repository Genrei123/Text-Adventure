"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGame = exports.getGame = exports.getGames = void 0;
const game_1 = __importDefault(require("../../model/game/game"));
const getGames = async () => {
    const games = await game_1.default.findAll();
    return games;
};
exports.getGames = getGames;
const getGame = async (id) => {
    const game = await game_1.default.findByPk(id);
    return game;
};
exports.getGame = getGame;
const addGame = async (req, res) => {
    const game = await game_1.default.create({
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
        status: req.status || 'draft', // Ensure status is included
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: req.UserId,
    });
    return game;
};
exports.addGame = addGame;
//# sourceMappingURL=gameService.js.map