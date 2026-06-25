// INDRASISH BISWAS, 24E102B91

import express from 'express';
// Import all the new individual functions instead of just getReportsData
import { 
    getCustomersOutstanding,
    getSuppliersOutstanding,
    getStockSummary,
    getSalesRegister,
    getPurchaseRegister
} from '../controllers/reportController.js'; 
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Split the single heavy route into 5 lightweight routes
router.get('/company/:companyId/reports/customers', isLoggedIn, getCustomersOutstanding);
router.get('/company/:companyId/reports/suppliers', isLoggedIn, getSuppliersOutstanding);
router.get('/company/:companyId/reports/stock', isLoggedIn, getStockSummary);
router.get('/company/:companyId/reports/sales', isLoggedIn, getSalesRegister);
router.get('/company/:companyId/reports/purchases', isLoggedIn, getPurchaseRegister);

export default router;