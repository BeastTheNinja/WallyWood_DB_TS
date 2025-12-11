import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Get all genres
export const getAllGenres = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        posters: {
          include: {
            poster: true,
          },
        },
      },
    });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af genrer' });
  }
};

// Get genre by ID
export const getGenreById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const genre = await prisma.genre.findUnique({
      where: { id: Number(id) },
      include: {
        posters: {
          include: {
            poster: true,
          },
        },
      },
    });

    if (!genre) {
      res.status(404).json({ error: 'Genre ikke fundet' });
      return;
    }

    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af genre' });
  }
};

// Get genre by slug
export const getGenreBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const genre = await prisma.genre.findUnique({
      where: { slug },
      include: {
        posters: {
          include: {
            poster: true,
          },
        },
      },
    });

    if (!genre) {
      res.status(404).json({ error: 'Genre ikke fundet' });
      return;
    }

    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af genre' });
  }
};

// Create genre (ADMIN only)
export const createGenre = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, slug } = req.body;

    if (!title || !slug) {
      res.status(400).json({ error: 'Title og slug er påkrævet' });
      return;
    }

    const genre = await prisma.genre.create({
      data: { title, slug },
    });

    res.status(201).json({ message: 'Genre oprettet', genre });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved oprettelse af genre' });
  }
};

// Update genre (ADMIN only)
export const updateGenre = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, slug } = req.body;

    const genre = await prisma.genre.update({
      where: { id: Number(id) },
      data: {
        title: title || undefined,
        slug: slug || undefined,
      },
    });

    res.json({ message: 'Genre opdateret', genre });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved opdatering af genre' });
  }
};

// Delete genre (ADMIN only)
export const deleteGenre = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.genre.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Genre slettet' });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved sletning af genre' });
  }
};
