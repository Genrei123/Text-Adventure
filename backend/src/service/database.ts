import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let DATABASE_URI:string = "DATABASE_URI SETUPS";
const sequelize = new Sequelize(DATABASE_URI);

export default sequelize;

