import express from 'express';
import { createCompany, getCompanies, getCompanyById, deleteCompany, updateCompany } from '../controllers/companyController.js';

import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Company routes
router.post('/company', isLoggedIn, createCompany);
router.get('/company', isLoggedIn, getCompanies);
router.get('/company/:id', isLoggedIn, getCompanyById);
router.delete('/company/:id', isLoggedIn, deleteCompany);
router.put('/company/:id', isLoggedIn, updateCompany);


export default router;