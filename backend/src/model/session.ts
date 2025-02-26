import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../service/database";

// Define the attributes of the Session model
interface SessionAttributes {
    id: string;
    email: string;
    startTime: Date;
    endTime?: Date;
    sessionData: object; // Change to JSONB type
    createdAt: Date;
    updatedAt: Date;
}

// Define the creation attributes for the Session model
interface SessionCreationAttributes extends Optional<SessionAttributes, "id" | "endTime" | "sessionData" | "createdAt" | "updatedAt"> {}

// Extend the Model class with the Session attributes
class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    public id!: string;
    public email!: string;
    public startTime!: Date;
    public endTime?: Date;
    public sessionData!: object; // Change to JSONB type
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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.DATE,
    },
    sessionData: {
        type: DataTypes.JSONB, // Use JSONB type
        allowNull: false,
        defaultValue: {},
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
    modelName: "Sessions",
    tableName: "Sessions",
    timestamps: true, // Enable automatic management of createdAt and updatedAt
});

export default Session;