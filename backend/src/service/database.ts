import { Sequelize } from "sequelize";
require("dotenv").config();

const DATABASE_URI = process.env.DATABASE_URI;
const sequelize = new Sequelize(DATABASE_URI?.toString() || "", {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, // Disable logging
});

export default sequelize;