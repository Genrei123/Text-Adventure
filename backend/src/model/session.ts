import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

interface SessionAttributes {
    id: string;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, "id"> {}

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    public id!: string;
}

Session.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
}, {
    sequelize,
    modelName: "Session",
});

export default Session;