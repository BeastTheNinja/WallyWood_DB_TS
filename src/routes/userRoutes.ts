import { Router } from 'express';
import { getRecords } from '../controller/userController.js';

const router = Router();
router.get('/', getRecords);

export const userRoutes = router;