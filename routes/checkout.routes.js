import express from 'express';

import {
  checkout,
  verifyTransaction,
} from '../controller/checkout.controller.js';
import { protect } from '../middleware/authentication.js';

const router = express.Router();

router.use(protect);
router.post('/', checkout);
router.post('/callback', verifyTransaction);

export default router;
