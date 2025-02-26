import { Sequelize } from "sequelize";
require("dotenv").config();

const DATABASE_URI = process.env.DATABASE_URI;
if (!DATABASE_URI) {
    throw new Error("DATABASE_URI is not defined in the environment variables");
}

const sequelize = new Sequelize(DATABASE_URI, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});

export { sequelize };
export default sequelize;