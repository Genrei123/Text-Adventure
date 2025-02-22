import express from 'express';
import { getAllUsers, getUserById, getUserByUsername, addUser, updateUser, deleteUser, getUserCommentsById, getUserRatingsById } from '../../controllers/user/userCRUDController';
import { get } from 'http';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/users/username/:username', getUserByUsername);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/comments/:id', getUserCommentsById);
router.get('/ratings/:id', getUserRatingsById);

export default router;