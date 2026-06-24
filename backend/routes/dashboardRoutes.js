import express from 'express';
import { getDashboardMetrics } from '../controllers//dashboardController.js';

import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard route
router.get('/company/:companyId/dashboard', isLoggedIn, getDashboardMetrics);

export default router;