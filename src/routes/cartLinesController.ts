import { Router } from 'express';
import {
  getAllCartlines,
  getCartlinesByUserId,
  getCartlineById,
  createCartline,
  updateCartline,
  deleteCartline,
  clearCart,
} from '../controller/cartLinesController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Admin - get all cartlines
router.get('/', authMiddleware, adminMiddleware, getAllCartlines);

// User - get own cart
router.get('/user/:userId', authMiddleware, getCartlinesByUserId);
router.get('/:id', authMiddleware, getCartlineById);

// User - manage cart
router.post('/', authMiddleware, createCartline);
router.put('/:id', authMiddleware, updateCartline);
router.delete('/:id', authMiddleware, deleteCartline);
router.delete('/user/:userId/clear', authMiddleware, clearCart);

export const cartLinesRoutes = router;
