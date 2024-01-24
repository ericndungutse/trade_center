import express from 'express';
import { getCompanies } from '../controller/company.controller.js';

const router = express.Router();

router.get('/', getCompanies);

export default router;
