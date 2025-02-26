import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../service/database";

interface RatingAttributes {
    id: number;
    score: number;
    createdAt: Date;
    updatedAt: Date;
    UserId: number;
    GameId: number;
}

interface RatingCreationAttributes extends Optional<RatingAttributes, "id" | "createdAt" | "updatedAt"> {}

class Rating extends Model<RatingAttributes, RatingCreationAttributes> implements RatingAttributes {
    public id!: number;
    public score!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public UserId!: number;
    public GameId!: number;
}

Rating.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
    },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    GameId: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    modelName: "Rating",
    tableName: "Ratings",
});

export default Rating;