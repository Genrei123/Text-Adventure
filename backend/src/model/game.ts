import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import utils from "../utils";
import User from "./user";

interface GameAttributes {
    id: number;
    title: string;
    slug: string;
    description: string;
    tagline: string;
    genre: string;
    subgenre: string;
    primary_color?: string;
    prompt_name: string;
    prompt_text?: string;
    prompt_model?: string;
    image_prompt_model?: string;
    image_prompt_name?: string;
    image_prompt_text?: string;
    image_data?: Buffer;
    music_prompt_text?: string;
    music_prompt_seed_image?: string;
    private: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface GameCreationAttributes extends Optional<GameAttributes, "id" | "slug" | "primary_color" | "prompt_text" | "prompt_model" | "image_prompt_model" | "image_prompt_name" | "image_prompt_text" | "image_data" | "music_prompt_text" | "music_prompt_seed_image"> {}

class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
    public id!: number;
    public title!: string;
    public slug!: string;
    public description!: string;
    public tagline!: string;
    public genre!: string;
    public subgenre!: string;
    public primary_color?: string;
    public prompt_name!: string;
    public prompt_text?: string;
    public prompt_model?: string;
    public image_prompt_model?: string;
    public image_prompt_name?: string;
    public image_prompt_text?: string;
    public image_data?: Buffer;
    public music_prompt_text?: string;
    public music_prompt_seed_image?: string;
    public private!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;

    public llm_fields!: {
        title: string;
        description: string;
        genre: string;
        subgenre: string;
        tagline: string;
        primary_color?: string;
    };
}

Game.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tagline: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subgenre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    primary_color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    prompt_name: {
        type: DataTypes.STRING,
        defaultValue: "UGC",
        allowNull: false,
    },
    prompt_text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    prompt_model: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "gpt-3.5-turbo",
    },
    image_prompt_model: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image_prompt_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image_prompt_text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_data: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    music_prompt_text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    music_prompt_seed_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    llm_fields: {
        type: DataTypes.VIRTUAL,
        get() {
            return {
                title: this.getDataValue("title"),
                description: this.getDataValue("description"),
                genre: this.getDataValue("genre"),
                subgenre: this.getDataValue("subgenre"),
                tagline: this.getDataValue("tagline"),
                primary_color: this.getDataValue("primary_color"),
            };
        },
        set() {
            throw new Error('Do not try to set the `llm_fields` value!');
        },
    },
}, {
    sequelize,
    modelName: "Game",
});

const create = Game.create.bind(Game);
Game.create = async function (game: GameCreationAttributes) {
    try {
        if (!game.slug) {
            game.slug = utils.slugify(game.title);
        }

        return await create(game);
    } catch (e) {
        if (e.name !== "SequelizeUniqueConstraintError") return e;
        if (e.errors.length !== 1) return e;
        if (e.errors[0].type !== "unique violation") return e;
        if (e.errors[0].path !== "slug") return e;

        // DUPLICATE SLUG...fix and try to save again
        game.slug = utils.slugify(`${game.title} ${utils.rand()}`);
        return await create(game);
    }
};

Game.belongsTo(User, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
User.hasMany(Game, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });

export default Game;