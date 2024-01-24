import express from 'express';
import {
  createProduct,
  getProducts,
} from '../controller/product.controller.js';
import { protect } from '../middleware/authentication.js';
import { restrictTo } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, restrictTo('admin'), createProduct);

export default router;
