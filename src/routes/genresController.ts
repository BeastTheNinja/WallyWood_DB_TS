import { Router } from 'express';
import {
  getAllGenres,
  getGenreById,
  getGenreBySlug,
  createGenre,
  updateGenre,
  deleteGenre,
} from '../controller/genresController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllGenres);
router.get('/:id', getGenreById);
router.get('/slug/:slug', getGenreBySlug);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createGenre);
router.put('/:id', authMiddleware, adminMiddleware, updateGenre);
router.delete('/:id', authMiddleware, adminMiddleware, deleteGenre);

export const genresRoutes = router;
