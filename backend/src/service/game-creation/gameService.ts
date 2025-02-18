import { AddGame } from "../../interfaces/game-creation/addGame";
import Game from "../../model/game/game";

export const getGames = async () => {
    const games = await Game.findAll();
    return games;
};

export const getGame = async (id: number) => {
    const game = await Game.findByPk(id);
    return game;
};

export const addGame = async (req: AddGame, res: any) => {
    const game = await Game.create({
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
};
