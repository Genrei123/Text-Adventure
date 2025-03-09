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
    await User.sync();
    await Game.sync();
    
    // Then sync {alter: true}dependent models
    await Comment.sync();
    await Rating.sync();
    await Order.sync();
    await Item.sync();
    await Chat.sync();
    await Ban.sync();
    await TokenPackage.sync();
    await SubscriptionOffers.sync();
    await Subscriber.sync();
    await Session.sync();
    
    
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