import { Request, Response } from 'express';
import UserService from '../../service/user/userService';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserById(parseInt(req.params.id));
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserByUsername(req.params.username);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const addUser = async (req: Request, res: Response) => {
    try {
        const addedUser = await UserService.addUser(req.body);
        res.status(201).json(addedUser);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await UserService.updateUser(parseInt(req.params.id), req.body);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deleted = await UserService.deleteUser(parseInt(req.params.id));
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};