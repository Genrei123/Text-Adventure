import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../service/database";

interface ChatAttributes {
    id: number;
    parent_id?: number;
    session_id: string;
    model: string;
    role: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    GameId: number;
    UserId?: number; // Make UserId optional
    image_prompt_name?: string;
    image_prompt_text?: string;
    image_url?: string;
}

interface ChatCreationAttributes extends Optional<ChatAttributes, "id" | "parent_id" | "UserId"> {} // Add UserId to Optional

class Chat extends Model<ChatAttributes, ChatCreationAttributes> implements ChatAttributes {
    public id!: number;
    public parent_id?: number;
    public session_id!: string;
    public model!: string;
    public role!: string;
    public content!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public GameId!: number;
    public UserId?: number; // Change to optional
    public image_prompt_name?: string;
    public image_prompt_text?: string;
    public image_url?: string;
}

Chat.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    parent_id: { type: DataTypes.INTEGER, allowNull: true },
    session_id: { type: DataTypes.STRING, allowNull: true },
    model: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    GameId: { type: DataTypes.INTEGER, allowNull: false },
    UserId: { type: DataTypes.INTEGER, allowNull: true }, // Change allowNull to true
    image_prompt_name: { type: DataTypes.STRING, allowNull: true },
    image_prompt_text: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.TEXT, allowNull: true },
}, {
    sequelize,
    modelName: "Chat",
});

export default Chat;