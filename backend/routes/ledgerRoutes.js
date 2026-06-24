import express from 'express';
import { createLedger, getLedgers, getLedgerById, updateLedger, deleteLedger } from '../controllers/ledgerController.js';

import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ledger routes
router.post('/company/:companyId/ledger', isLoggedIn, createLedger);
router.get('/company/:companyId/ledger', isLoggedIn, getLedgers);
router.get('/company/:companyId/ledger/:id', isLoggedIn, getLedgerById);
router.put('/company/:companyId/ledger/:id', isLoggedIn, updateLedger);
router.delete('/company/:companyId/ledger/:id', isLoggedIn, deleteLedger);


export default router;