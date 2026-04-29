import { Router } from 'express';
import {
  listVendors,
  addVendor,
  getVendorDetails,
  updateVendor,
  softDeleteVendor,
  searchVendors,
  getVendorsDropdown,
} from '../controllers/vendor.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listVendors);
router.post('/', addVendor);
router.get('/search', searchVendors);
router.get('/dropdown', getVendorsDropdown);
router.get('/:id', getVendorDetails);
router.patch('/:id', updateVendor);
router.delete('/:id', softDeleteVendor);

export default router;
