import { Router } from 'express';
import {
  getAllRatings,
  getRatingsByPosterId,
  getRatingsByUserId,
  getRatingById,
  createRating,
  deleteRating,
  getAverageRating,
} from '../controller/userRatingsController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllRatings);
router.get('/:id', getRatingById);
router.get('/poster/:posterId', getRatingsByPosterId);
router.get('/poster/:posterId/average', getAverageRating);
router.get('/user/:userId', authMiddleware, getRatingsByUserId);

// User - create/update own rating
router.post('/', authMiddleware, createRating);

// Admin - delete any rating
router.delete('/:id', authMiddleware, adminMiddleware, deleteRating);

export const ratingsRoutes = router;
