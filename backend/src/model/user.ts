import { DataTypes } from "sequelize";
import database from "../service/database";

const User = database.define('User', {
    username: {
        type: DataTypes.STRING
    },

    password: {
        type: DataTypes.STRING
    }
});

