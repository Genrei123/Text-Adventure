import User from "./user/user";
import Game from "./game/game";
import Comment from "./game/comments";
import Rating from "./game/rating";
import Order from "./transaction/order"; // Adjust path
import Chat from "./chat/chat"; // Adjust path

const defineAssociations = () => {
    // User <-> Game
    User.hasMany(Game, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Game.belongsTo(User, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // User <-> Comment
    User.hasMany(Comment, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Comment.belongsTo(User, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Game <-> Comment
    Game.hasMany(Comment, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Comment.belongsTo(Game, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // User <-> Rating
    User.hasMany(Rating, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Rating.belongsTo(User, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Game <-> Rating
    Game.hasMany(Rating, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Rating.belongsTo(Game, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // User <-> Order
    User.hasMany(Order, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Order.belongsTo(User, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // User <-> Chat
    User.hasMany(Chat, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Chat.belongsTo(User, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Game <-> Chat
    Game.hasMany(Chat, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Chat.belongsTo(Game, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
};

export default defineAssociations;