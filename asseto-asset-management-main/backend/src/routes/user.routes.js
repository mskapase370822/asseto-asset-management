import { Router } from 'express';
import {
  listUsers,
  addUser,
  getUserDetails,
  updateUser,
  softDeleteUser,
  searchUsers,
  getProfile,
  getRoles,
  resetUserPassword,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.get('/', listUsers);
router.post('/', addUser);
router.get('/profile', getProfile);
router.get('/roles', getRoles);
router.get('/search', searchUsers);
router.get('/:id', getUserDetails);
router.patch('/:id', uploadSingle('profile_pic'), updateUser);
router.delete('/:id', softDeleteUser);
router.post('/:id/reset-password', resetUserPassword);

export default router;
