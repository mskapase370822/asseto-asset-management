import { Router } from 'express';
import {
  listLicenses,
  addLicense,
  getLicenseDetails,
  updateLicense,
  softDeleteLicense,
  assignLicense,
  unassignLicense,
} from '../controllers/license.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listLicenses);
router.post('/', addLicense);
router.get('/:id', getLicenseDetails);
router.patch('/:id', updateLicense);
router.delete('/:id', softDeleteLicense);
router.post('/:id/assign', assignLicense);
router.post('/:id/unassign', unassignLicense);

export default router;
