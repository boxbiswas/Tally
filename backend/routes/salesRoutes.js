import express from 'express';
import { createSales, getSales, getSalesById } from '../controllers/salesController.js';

import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sales routes
router.post('/company/:companyId/sales', isLoggedIn, createSales);
router.get('/company/:companyId/sales', isLoggedIn, getSales);
router.get('/company/:companyId/sales/:id', isLoggedIn, getSalesById);


export default router;