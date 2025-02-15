import express from 'express';
import { getAllUsers, getUserById, getUserByUsername, addUser, updateUser, deleteUser } from '../../controllers/user/userCRUDController';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/users/username/:username', getUserByUsername);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;