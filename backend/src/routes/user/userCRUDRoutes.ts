import express from 'express';
import { getAllUsers, getUserById, getUserByUsername, addUser, updateUser, deleteUser, getUserCommentsById, getUserRatingsById, getUserRatingsByUsername, getUserCommentsByUsername, getUserByEmail, getVerifiedUsers, playerDirectory } from '../../controllers/user/userCRUDController';
import { get } from 'http';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/verified', getVerifiedUsers);
router.get('/users/:id', getUserById);
router.get('/users/username/:username', getUserByUsername);
router.get('/users/verify/:email', getUserByEmail);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/users/:id/comments', getUserCommentsById);
router.get('/users/:id/ratings', getUserRatingsById);

router.get('/users/username/:username/comments', getUserCommentsByUsername);
router.get('/users/username/:username/ratings', getUserRatingsByUsername);

router.get('/users/subscriptions', playerDirectory);

export default router;