import cron from 'node-cron';
import { Ban, Player } from '../model';
import { io } from '../websocket/socket';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'server.log' })],
});

const unbanExpiredPlayers = async () => {
  try {
    const expiredBans = await Ban.findAll({
      where: {
        ban_type: 'temporary',
        unban_date: {
          [Op.lte]: new Date(),
        },
      },
    });

    for (const ban of expiredBans) {
      const player = await Player.findByPk(ban.player_id);
      if (player) {
        await ban.destroy();
        io.emit('ban-update', { username: player.username, action: 'unbanned' });
        logger.info(`Player ${player.username} unbanned automatically`);
      }
    }
  } catch (error) {
    logger.error(`Error unbanning players: ${error.message}`);
  }
};

// Schedule the job to run every hour
cron.schedule('0 * * * *', unbanExpiredPlayers);