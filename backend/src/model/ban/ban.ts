import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../service/database';
import User from '../user/user';

interface BanAttributes {
    id: number;
    userId: number;
    reason: string;
    banType: 'temporary' | 'permanent';
    endDate?: Date;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface BanCreationAttributes extends Optional<BanAttributes, 'id' | 'endDate' | 'comment'> {}

class Ban extends Model<BanAttributes, BanCreationAttributes> implements BanAttributes {
    public id!: number;
    public userId!: number;
    public reason!: string;
    public banType!: 'temporary' | 'permanent';
    public endDate?: Date;
    public comment?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Ban.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING, allowNull: false },
    banType: { type: DataTypes.STRING, allowNull: false },
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