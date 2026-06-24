import express from 'express';
import { createItem, getItems, getItemById, deleteItem, updateItem  } from '../controllers/stockController.js';

import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Stock routes
router.post('/company/:companyId/item', isLoggedIn, createItem)
router.get('/company/:companyId/item', isLoggedIn, getItems);
router.get('/company/:companyId/item/:id', isLoggedIn, getItemById);
router.delete('/company/:companyId/item/:id', isLoggedIn, deleteItem);
router.put('/company/:companyId/item/:id', isLoggedIn, updateItem);


export default router;