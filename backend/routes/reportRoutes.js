import express from 'express';
import { getReportsData } from '../controllers/reportController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Report routes
router.get('/company/:companyId/reports', isLoggedIn, getReportsData);

export default router;