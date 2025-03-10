import { sequelize } from "./database"; // Import after sequelize is defined
import User from "../model/user/user";
import Game from "../model/game/game";
import Comment from "../model/game/comments";
import Rating from "../model/game/rating";
import Order from "../model/transaction/order";
import Item from "../model/transaction/ItemModel"; // Adjust path if needed
import Chat from "../model/chat/chat";
import Ban from '../model/ban/ban';
import defineAssociations from "../model/associations";
import TokenPackage from "../model/transaction/TokenPackageModel";
import SubscriptionOffers from "../model/transaction/SubscriptionOffersModel";
import Subscriber from "../model/transaction/SubscriberModel";
import Session from "../model/session";

export const initializeModels = async () => {
  try {
    // First create tables without foreign keys
    await User.sync({alter: true});
    await Game.sync({alter: true});
    
    // Then sync {alter: true}dependent models
    await Comment.sync({alter: true});
    await Rating.sync({alter: true});
    await Order.sync({alter: true});
    await Item.sync({alter: true});
    await Chat.sync({alter: true});
    await Ban.sync({alter: true});
    await TokenPackage.sync({alter: true});
    await SubscriptionOffers.sync({alter: true});
    await Subscriber.sync({alter: true});
    await Session.sync({alter: true});
    
    
    // Define associations
    defineAssociations();

    console.log("Database tables synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
    throw error;
  }
};

// Export models for use elsewhere
export { User, Game, Comment, Rating, Order, Item, Chat, Ban };