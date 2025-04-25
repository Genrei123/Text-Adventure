import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../service/database";

interface CommentAttributes {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    UserId: number;
    GameId: number;
    likes: boolean;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "id" | "createdAt" | "updatedAt" | "likes"> {} // Included 'likes' in Optional

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public id!: number;
    public content!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public UserId!: number;
    public GameId!: number;
    public likes!: boolean;
}

Comment.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    GameId: { type: DataTypes.INTEGER, allowNull: false },
    likes: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    modelName: "Comment",
    tableName: "Comments",
});

export default Comment;
