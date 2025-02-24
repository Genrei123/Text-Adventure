import express from 'express';
import { createBan, updateBan, getAllBans, getTemporaryBans, getPermanentBans, deleteBan, searchUsers } from '../service/banService';

const router = express.Router();

router.post('/bans', async (req, res) => {
    try {
        const ban = await createBan(req.body);
        res.status(201).json(ban);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ban', error });
    }
});

router.put('/bans/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        await updateBan(Number(id), comment);
        res.status(200).json({ message: 'Ban updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ban', error });
    }
});

router.get('/bans', async (req, res) => {
    try {
        const bans = await getAllBans();
        res.status(200).json(bans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bans', error });
    }
});

router.get('/bans/temporary', async (req, res) => {
    try {
        const bans = await getTemporaryBans();
        res.status(200).json(bans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching temporary bans', error });
    }
});

router.get('/bans/permanent', async (req, res) => {
    try {
        const bans = await getPermanentBans();
        res.status(200).json(bans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permanent bans', error });
    }
});

router.delete('/bans/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deleteBan(Number(id));
        res.status(200).json({ message: 'Ban deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ban', error });
    }
});

// New route to search users
router.get('/users/search', async (req, res) => {
    try {
        const { term } = req.query;
        const users = await searchUsers(term as string);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error searching users', error });
    }
});

export default router;