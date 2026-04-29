import { Router } from 'express';
import {
  listAssets,
  addAsset,
  getAssetDetails,
  updateAsset,
  softDeleteAsset,
  searchAssets,
  assignAsset,
  unassignAsset,
  updateAssetStatus,
  getNotifications,
  markNotificationRead,
  getWarrantyExpiredFlag,
  scanBarcode,
  getUsersForAssign,
} from '../controllers/asset.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listAssets);
router.post('/', addAsset);
router.get('/search', searchAssets);
router.get('/notifications', getNotifications);
router.patch('/notifications/mark-read', markNotificationRead);
router.get('/warranty-flag', getWarrantyExpiredFlag);
router.get('/scan/:tag', scanBarcode);
router.get('/:id', getAssetDetails);
router.patch('/:id', updateAsset);
router.delete('/:id', softDeleteAsset);
router.patch('/:id/status', updateAssetStatus);
router.post('/:id/assign', assignAsset);
router.post('/:id/unassign', unassignAsset);
router.get('/:id/users-for-assign', getUsersForAssign);

export default router;
