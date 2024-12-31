import { Sequelize } from "sequelize";
require("dotenv").config();

const DATABASE_URI = process.env.DATABASE_URI;
const sequelize = new Sequelize(DATABASE_URI?.toString() || "");

export default sequelize;

