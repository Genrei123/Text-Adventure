import { sequelize } from "./database"; // Import after sequelize is defined
import User from "../model/user/user";
import Game from "../model/game/game";
import Comment from "../model/game/comments";
import Rating from "../model/game/rating";
import Order from "../model/transaction/order";
import Item from "../model/transaction/ItemModel"; // Adjust path if needed
import Chat from "../model/chat/chat";
import defineAssociations from "../model/associations";

export const initializeModels = async () => {
    try {
        // Reference models to ensure they’re initialized
        User;
        Game;
        Comment;
        Rating;
        Order;
        Item;
        Chat;

        // Define associations
        defineAssociations();

        // Sync the database
        await sequelize.sync({ alter: true });
        console.log("Database and models synchronized successfully.");
    } catch (error) {
        console.error("Error synchronizing database and models:", error);
        throw error;
    }
};

// Export models for use elsewhere
export { User, Game, Comment, Rating, Order, Item, Chat };