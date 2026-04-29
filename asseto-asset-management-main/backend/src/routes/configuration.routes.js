import { Router } from 'express';
import {
  getTagConfig,
  updateTagConfig,
  getLocalization,
  updateLocalization,
  getBranding,
  updateBranding,
  getExtensions,
  updateExtension,
  getSlackConfig,
  updateSlackConfig,
  generateAutoTag,
  getDepartments,
  createDepartment,
  getLocations,
  createLocation,
  getProductTypes,
  createProductType,
  getProductCategories,
  createProductCategory,
} from '../controllers/configuration.controller.js';
import { protect } from '../middleware/auth.js';
import { uploadFields } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.get('/tag', getTagConfig);
router.patch('/tag', updateTagConfig);
router.get('/localization', getLocalization);
router.patch('/localization', updateLocalization);
router.get('/branding', getBranding);
router.patch(
  '/branding',
  uploadFields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
    { name: 'login_page_logo', maxCount: 1 },
  ]),
  updateBranding
);
router.get('/extensions', getExtensions);
router.patch('/extensions/:id', updateExtension);
router.get('/slack', getSlackConfig);
router.patch('/slack', updateSlackConfig);
router.get('/auto-tag', generateAutoTag);
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.get('/locations', getLocations);
router.post('/locations', createLocation);
router.get('/product-types', getProductTypes);
router.post('/product-types', createProductType);
router.get('/product-categories', getProductCategories);
router.post('/product-categories', createProductCategory);

export default router;
