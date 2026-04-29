import { Router } from 'express';
import {
  listPendingAudits,
  listCompletedAudits,
  addAudit,
  getAuditDetails,
  getTagsList,
  getAssignedUser,
} from '../controllers/audit.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/pending', listPendingAudits);
router.get('/completed', listCompletedAudits);
router.post('/', addAudit);
router.get('/tags', getTagsList);
router.get('/assigned-user/:tag', getAssignedUser);
router.get('/:id', getAuditDetails);

export default router;
