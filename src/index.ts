import express from 'express';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes.js';
import { postersRoutes } from './routes/postersRoutes.js';
import { genresRoutes } from './routes/genresController.js';
import { cartLinesRoutes } from './routes/cartLinesController.js';
import { ratingsRoutes } from './routes/ratingsRoutes.js';

// Load environment variables
dotenv.config({ quiet: true });

// Use port from .env or default to 3000
const port = process.env.PORT || 3000;

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posters', postersRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/cartlines', cartLinesRoutes);
app.use('/api/ratings', ratingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});