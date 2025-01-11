import express, { Request, Response } from 'express';
import User from '../model/user';

const router = express.Router();

// Get all users
router.get('/users', async (req: Request, res: Response) => {
    const users = await User.findAll();
    res.json(users);
});

// Get user by ID
router.get('/users/:id', async (req: Request, res: Response) => {
    const user = await User.findByPk(parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// Add a new user
router.post('/users', async (req: Request, res: Response) => {
    const addedUser = await User.addUser(req.body);
    res.status(201).json(addedUser);
});

// Update a user
router.put('/users/:id', async (req: Request, res: Response) => {
    const updatedUser = await User.updateUser(parseInt(req.params.id), req.body);
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404).send('User not found');
    }
});

// Delete a user
router.delete('/users/:id', async (req: Request, res: Response) => {
    const deleted = await User.deleteUser(parseInt(req.params.id));
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).send('User not found');
    }
});

export default router;