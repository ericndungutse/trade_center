import express from 'express';

import { protect } from '../middleware/authentication.js';
import { getOrders } from '../controller/order.controller.js';

const router = express.Router();

router.get('/', protect, getOrders);

export default router;
