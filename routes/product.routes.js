import express from 'express';
import { createProduct } from '../controller/product.controller.js';
import { protect } from '../middleware/authentication.js';
import { restrictTo } from '../middleware/authorize.js';

const router = express.Router();

router.post('/', protect, restrictTo('admin'), createProduct);

export default router;
