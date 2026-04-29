import { Router } from 'express';
import {
  listNotifications,
  markAsRead,
  markAllRead,
  getUnreadCount,
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/mark-all-read', markAllRead);
router.patch('/:id/read', markAsRead);

export default router;
