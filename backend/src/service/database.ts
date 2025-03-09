import { Sequelize } from "sequelize";
import 'dotenv/config';

const DATABASE_URI = process.env.DATABASE_URI;
if (!DATABASE_URI) {
    throw new Error("DATABASE_URI is not defined in environment variables");
}

const sequelize = new Sequelize(DATABASE_URI, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});

export { sequelize, Sequelize };
export default sequelize;