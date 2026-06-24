import express from 'express';
import { createPurchase, getPurchases, getPurchaseById } from '../controllers/purchaseController.js';

import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Purchase routes
router.post('/company/:companyId/purchase', isLoggedIn, createPurchase);
router.get('/company/:companyId/purchase', isLoggedIn, getPurchases);
router.get('/company/:companyId/purchase/:id', isLoggedIn, getPurchaseById);


export default router;