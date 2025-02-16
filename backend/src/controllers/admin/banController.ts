import { Request, Response } from 'express';
import { Ban, Player } from '../../model';
import { io } from '../../websocket/socket';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'server.log' })],
});

export const banPlayer = async (req: Request, res: Response) => {
  const { username, reason, banType, unbanDate } = req.body;
  if (!username || !reason || !banType) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    const player = await Player.findOne({ where: { username } });
    if (!player) {
      return res.status(404).json({ message: 'Player not found.' });
    }
    const ban = await Ban.create({
      player_id: player.id,
      reason,
      ban_type: banType,
      unban_date: banType === 'temporary' ? new Date(unbanDate) : null,
    });
    io.emit('ban-update', { username, action: 'banned' });
    logger.info(`Player ${username} banned for reason: ${reason}`);
    res.status(201).json({ message: `${username} has been banned successfully.` });
  } catch (error) {
    logger.error(`Error banning player: ${error.message}`);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const unbanPlayer = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    const player = await Player.findOne({ where: { username } });
    if (!player) {
      return res.status(404).json({ message: 'Player not found.' });
    }
    await Ban.destroy({ where: { player_id: player.id } });
    io.emit('ban-update', { username, action: 'unbanned' });
    logger.info(`Player ${username} unbanned`);
    res.status(200).json({ message: `${username} has been unbanned successfully.` });
  } catch (error) {
    logger.error(`Error unbanning player: ${error.message}`);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getBannedPlayers = async (req: Request, res: Response) => {
  try {
    const bannedPlayers = await Ban.findAll({ include: [Player] });
    res.status(200).json(bannedPlayers);
  } catch (error) {
    logger.error(`Error fetching banned players: ${error.message}`);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};