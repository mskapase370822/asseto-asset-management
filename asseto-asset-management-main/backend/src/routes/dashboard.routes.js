import { Router } from 'express';
import {
  getAssetStats,
  getUserStats,
  getProductStats,
  getVendorStats,
  getLocationStats,
  getRecentActivity,
} from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/assets', getAssetStats);
router.get('/users', getUserStats);
router.get('/products', getProductStats);
router.get('/vendors', getVendorStats);
router.get('/locations', getLocationStats);
router.get('/activity', getRecentActivity);

export default router;
