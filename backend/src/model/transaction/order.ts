import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../service/database";
import User from "../user/user";

// Define the attributes of the Order model
interface OrderAttributes {
    id: number;
    order_id: string;
    email: string;
    client_reference_id: string;
    order_details: object;
    paid_amount: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    received_coins: number;
}

// Define the creation attributes for the Order model
interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

// Extend the Model class with the Order attributes
class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public order_id!: string;
    public email!: string;
    public client_reference_id!: string;
    public order_details!: object;
    public paid_amount!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public userId!: number;
    public received_coins!: number;
}

// Initialize the Order model
Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_reference_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    order_details: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    paid_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    received_coins: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: "Orders",
});

// Define the relationship between Order and User
Order.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Order, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Order;