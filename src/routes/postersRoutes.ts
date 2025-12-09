import { Router } from 'express';
import {
  getAllPosters,
  getPosterById,
  getPosterBySlug,
  createPoster,
  updatePoster,
  deletePoster,
} from '../controller/postersController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllPosters);
router.get('/:id', getPosterById);
router.get('/slug/:slug', getPosterBySlug);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createPoster);
router.put('/:id', authMiddleware, adminMiddleware, updatePoster);
router.delete('/:id', authMiddleware, adminMiddleware, deletePoster);

export const postersRoutes = router;
