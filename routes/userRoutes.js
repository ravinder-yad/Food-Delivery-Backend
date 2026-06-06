import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, getWalletDetails, addFundsToWallet } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/wallet', getWalletDetails);
router.post('/:id/wallet/add', addFundsToWallet);

export default router;
