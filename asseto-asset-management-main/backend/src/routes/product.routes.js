import { Router } from 'express';
import {
  listProducts,
  addProduct,
  getProductDetails,
  updateProduct,
  softDeleteProduct,
  searchProducts,
  getProductsDropdown,
} from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listProducts);
router.post('/', addProduct);
router.get('/search', searchProducts);
router.get('/dropdown', getProductsDropdown);
router.get('/:id', getProductDetails);
router.patch('/:id', updateProduct);
router.delete('/:id', softDeleteProduct);

export default router;
