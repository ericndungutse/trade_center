import express from 'express';
import { getCompanies, getCompany } from '../controller/company.controller.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompany);

export default router;
