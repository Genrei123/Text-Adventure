import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../service/database";

interface OrderAttributes {
    id: number;
    order_id: string;
    email: string;
    client_reference_id: string;
    order_details: object;
    paid_amount: number;
    createdAt: Date;
    updatedAt: Date;
    UserId: number | null;  // Updated to allow null temporarily
    received_coins: number;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public order_id!: string;
    public email!: string;
    public client_reference_id!: string;
    public order_details!: object;
    public paid_amount!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public UserId!: number | null;  // Updated to allow null temporarily
    public received_coins!: number;
}

Order.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false },
    client_reference_id: { type: DataTypes.STRING, allowNull: false },
    order_details: { type: DataTypes.JSON, allowNull: false },
    paid_amount: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Changed to true temporarily
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    received_coins: { type: DataTypes.INTEGER, allowNull: true },
}, {
    sequelize,
    modelName: "Order",
});

export default Order;