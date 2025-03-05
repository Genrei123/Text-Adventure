import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../service/database";

// Define emotion types
type RoleplayEmotion = 'neutral' | 'excited' | 'sad' | 'angry' | 'surprised' | 'playful';

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
    UserId?: number;
    image_prompt_name?: string;
    image_prompt_text?: string;
    image_url?: string;
    
    // New roleplay-specific fields
    roleplay_emotion?: RoleplayEmotion;
    roleplay_action?: string;
    roleplay_character_state?: string;
    roleplay_narrative_impact?: number;
}

interface ChatCreationAttributes extends Optional<ChatAttributes, "id" | "parent_id" | "UserId"> {}

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
    public UserId?: number;
    public image_prompt_name?: string;
    public image_prompt_text?: string;
    public image_url?: string;
    
    // New roleplay-specific properties
    public roleplay_emotion?: RoleplayEmotion;
    public roleplay_action?: string;
    public roleplay_character_state?: string;
    public roleplay_narrative_impact?: number;
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
    UserId: { type: DataTypes.INTEGER, allowNull: true },
    image_prompt_name: { type: DataTypes.STRING, allowNull: true },
    image_prompt_text: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.TEXT, allowNull: true },
    
    // New roleplay-specific fields
    roleplay_emotion: { 
        type: DataTypes.ENUM('neutral', 'excited', 'sad', 'angry', 'surprised', 'playful'), 
        allowNull: true 
    },
    roleplay_action: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    roleplay_character_state: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    roleplay_narrative_impact: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        validate: {
            min: 0,
            max: 10
        }
    },
}, {
    sequelize,
    modelName: "Chat",
});

export default Chat;