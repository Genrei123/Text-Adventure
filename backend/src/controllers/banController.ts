/**
 * Controller to create a new ban.
 * @param req - The request object.
 * @param res - The response object.
 */
export const createBan = async (req: Request, res: Response) => {
  try {
    const ban = await Ban.create(req.body);
    console.log(`[BanController] Created ban ID ${ban.id}`);
    res.status(201).json(ban);
  } catch (error) {
    console.error('[BanController] Create error:', error);
    res.status(400).json({ 
      error: 'Invalid ban data',
      details: error.errors?.map((e: any) => e.message) 
    });
  }
};

/**
 * Controller to fetch all bans.
 * @param req - The request object.
 * @param res - The response object.
 */
export const getBans = async (req: Request, res: Response) => {
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