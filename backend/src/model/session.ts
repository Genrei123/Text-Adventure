import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../service/database";

// Define the attributes of the Session model
interface SessionAttributes {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the creation attributes for the Session model
interface SessionCreationAttributes extends Optional<SessionAttributes, "id"> {}

// Extend the Model class with the Session attributes
class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    public id!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Initialize the Session model
Session.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: "Session",
    timestamps: true, // Enable automatic management of createdAt and updatedAt
});

export default Session;