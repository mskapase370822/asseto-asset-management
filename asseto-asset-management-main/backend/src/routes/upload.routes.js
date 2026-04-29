import { Router } from 'express';
import { uploadImage, importAssetsCSV, importUsersCSV } from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.post('/image', uploadSingle('image'), uploadImage);
router.post('/csv/assets', uploadSingle('file'), importAssetsCSV);
router.post('/csv/users', uploadSingle('file'), importUsersCSV);

export default router;
