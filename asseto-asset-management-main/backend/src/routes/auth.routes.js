import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  generateOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/token/refresh', refreshToken);
router.post('/logout', logout);
router.get('/generate-otp', protect, generateOtp);
router.post('/verify-otp', protect, verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);

export default router;
