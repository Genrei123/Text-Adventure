import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../service/database';
import User from '../user/user';

interface BanAttributes {
    id: number;
    userId: number;
    username: string; // Add username field
    reason: string;
    banType: 'temporary' | 'permanent' | 'reported';
    endDate?: Date;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface BanCreationAttributes extends Optional<BanAttributes, 'id' | 'endDate' | 'comment'> {}

class Ban extends Model<BanAttributes, BanCreationAttributes> implements BanAttributes {
    public id!: number;
    public userId!: number;
    public username!: string; // Add username field
    public reason!: string;
    public banType!: 'temporary' | 'permanent' | 'reported';
    public endDate?: Date;
    public comment?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Ban.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false }, // Add username field
    reason: { type: DataTypes.STRING, allowNull: false },
    banType: { 
        type: DataTypes.ENUM('permanent', 'temporary', 'reported'),
        allowNull: false
    },
    endDate: { type: DataTypes.DATE, allowNull: true },
    comment: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
    sequelize,
    modelName: 'Ban',
    tableName: 'Bans',
    timestamps: true,
});

Ban.belongsTo(User, { foreignKey: 'userId' });

export default Ban;