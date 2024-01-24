import express from 'express';
import { login, signUp } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', login);

export default router;
