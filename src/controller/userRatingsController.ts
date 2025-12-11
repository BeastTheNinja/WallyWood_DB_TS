import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Get all ratings
export const getAllRatings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ratings = await prisma.userRating.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        poster: true,
      },
    });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af bedømmelser' });
  }
};

// Get ratings for a poster
export const getRatingsByPosterId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { posterId } = req.params;
    const ratings = await prisma.userRating.findMany({
      where: { posterId: Number(posterId) },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af bedømmelser' });
  }
};

// Get ratings by user
export const getRatingsByUserId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const ratings = await prisma.userRating.findMany({
      where: { userId: Number(userId) },
      include: {
        poster: true,
      },
    });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af bedømmelser' });
  }
};

// Get rating by ID
export const getRatingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rating = await prisma.userRating.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        poster: true,
      },
    });

    if (!rating) {
      res.status(404).json({ error: 'Bedømmelse ikke fundet' });
      return;
    }

    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af bedømmelse' });
  }
};

// Create or update rating
export const createRating = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, posterId, numStars } = req.body;

    if (!userId || !posterId || numStars === undefined) {
      res.status(400).json({ error: 'userId, posterId og numStars er påkrævet' });
      return;
    }

    if (numStars < 1 || numStars > 5) {
      res.status(400).json({ error: 'Bedømmelse skal være mellem 1 og 5' });
      return;
    }

    // Check if rating already exists
    const existing = await prisma.userRating.findUnique({
      where: { userId_posterId: { userId: Number(userId), posterId: Number(posterId) } },
    });

    if (existing) {
      // Update existing rating
      const updated = await prisma.userRating.update({
        where: { id: existing.id },
        data: { numStars: Number(numStars) },
      });
      res.json({ message: 'Bedømmelse opdateret', rating: updated });
      return;
    }

    const rating = await prisma.userRating.create({
      data: {
        userId: Number(userId),
        posterId: Number(posterId),
        numStars: Number(numStars),
      },
    });

    res.status(201).json({ message: 'Bedømmelse oprettet', rating });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved oprettelse af bedømmelse' });
  }
};

// Delete rating
export const deleteRating = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.userRating.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Bedømmelse slettet' });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved sletning af bedømmelse' });
  }
};

// Get average rating for a poster
export const getAverageRating = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { posterId } = req.params;

    const ratings = await prisma.userRating.findMany({
      where: { posterId: Number(posterId) },
    });

    if (ratings.length === 0) {
      res.json({ posterId: Number(posterId), averageRating: 0, totalRatings: 0 });
      return;
    }

    const average = ratings.reduce((sum, r) => sum + r.numStars, 0) / ratings.length;

    res.json({
      posterId: Number(posterId),
      averageRating: Math.round(average * 10) / 10,
      totalRatings: ratings.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved beregning af gennemsnitsvurdering' });
  }
};
