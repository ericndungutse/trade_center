import express from 'express';

import { checkout } from '../controller/payment.controller.js';
import { protect } from '../middleware/authentication.js';

const router = express.Router();

router.post('/', protect, checkout);

export default router;
