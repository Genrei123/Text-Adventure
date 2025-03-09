import Ban from '../../model/ban/ban';
import User from '../../model/user/user';
import { Request, Response, RequestHandler } from 'express';

/**
 * Controller to create a new ban.
 * @param req - The request object.
 * @param res - The response object.
 */
export const createBan: RequestHandler = async (req: Request, res: Response) => {
  try {
    const ban = await Ban.create(req.body);
    console.log(`[BanController] Created ban ID ${ban.id}`);
    res.status(201).json(ban);
  } catch (error) {
    console.error('[BanController] Create error:', error);
    const err = error as { errors?: { message: string }[] };
    res.status(400).json({ 
      error: 'Invalid ban data',
      details: err.errors?.map(e => e.message) 
    });
  }
};

/**
 * Controller to fetch all bans.
 * @param req - The request object.
 * @param res - The response object.
 */
export const getBans: RequestHandler = async (req: Request, res: Response) => {
  try {
    const bans = await Ban.findAll({
      include: [{ model: User, attributes: ['username'] }]
    });
    console.log(`[BanController] Fetched ${bans.length} bans`);
    res.json(bans);
  } catch (error) {
    console.error('[BanController] Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch bans' });
  }
};

/**
 * Controller to remove a ban.
 * @param req - The request object.
 * @param res - The response object.
 */
export const removeBan: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const deletedCount = await Ban.destroy({
      where: { userId }
    });

    if (deletedCount === 0) {
      res.status(404).json({ error: 'Ban not found' });
      return;
    }

    console.log(`[BanController] Removed ban for user ID ${userId}`);
    res.status(200).json({ message: 'Ban removed successfully' });
  } catch (error) {
    console.error('[BanController] Remove error:', error);
    res.status(500).json({ error: 'Failed to remove ban' });
  }
};