import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/sequelize";

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
  status: string;
  createdAt: Date;
  updatedAt: Date;
  UserId?: number;
}

interface GameCreationAttributes extends Optional<GameAttributes, "id" | "primary_color" | "prompt_text" | "prompt_model" | "image_prompt_model" | "image_prompt_name" | "image_prompt_text" | "image_data" | "music_prompt_text" | "music_prompt_seed_image" | "createdAt" | "updatedAt"> {}

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
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public UserId?: number;
}

Game.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: false },
  tagline: { type: DataTypes.TEXT, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  subgenre: { type: DataTypes.STRING, allowNull: false },
  primary_color: { type: DataTypes.STRING, allowNull: true },
  prompt_name: { type: DataTypes.STRING, defaultValue: "UGC", allowNull: false },
  prompt_text: { type: DataTypes.TEXT, allowNull: true },
  prompt_model: { type: DataTypes.STRING, allowNull: true, defaultValue: "gpt-3.5-turbo" },
  image_prompt_model: { type: DataTypes.STRING, allowNull: true },
  image_prompt_name: { type: DataTypes.STRING, allowNull: true },
  image_prompt_text: { type: DataTypes.TEXT, allowNull: true },
  image_data: { type: DataTypes.BLOB, allowNull: true },
  music_prompt_text: { type: DataTypes.TEXT, allowNull: true },
  music_prompt_seed_image: { type: DataTypes.STRING, allowNull: true },
  private: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "draft" },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'createdAt' },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updatedAt' },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: "Game",
  tableName: 'games'
});

export default Game;