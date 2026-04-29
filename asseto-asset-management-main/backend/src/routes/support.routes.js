import { Router } from 'express';
import {
  listSupport,
  addSupport,
  updateSupport,
  deleteSupport,
} from '../controllers/support.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listSupport);
router.post('/', addSupport);
router.patch('/:id', updateSupport);
router.delete('/:id', deleteSupport);

export default router;
