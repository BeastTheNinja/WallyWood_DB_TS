import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Get all posters
export const getAllPosters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posters = await prisma.poster.findMany({
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
    res.json(posters);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af plakater' });
  }
};

// Get poster by ID
export const getPosterById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const poster = await prisma.poster.findUnique({
      where: { id: Number(id) },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        userRatings: true,
      },
    });

    if (!poster) {
      res.status(404).json({ error: 'Plakat ikke fundet' });
      return;
    }

    res.json(poster);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af plakat' });
  }
};

// Get poster by slug
export const getPosterBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const poster = await prisma.poster.findUnique({
      where: { slug },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        userRatings: true,
      },
    });

    if (!poster) {
      res.status(404).json({ error: 'Plakat ikke fundet' });
      return;
    }

    res.json(poster);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af plakat' });
  }
};

// Create poster (ADMIN only)
export const createPoster = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, description, image, width, height, price, stock } = req.body;

    if (!name || !slug || !description || !image || !width || !height || !price || stock === undefined) {
      res.status(400).json({ error: 'Alle felter skal udfyldes' });
      return;
    }

    const poster = await prisma.poster.create({
      data: {
        name,
        slug,
        description,
        image,
        width: Number(width),
        height: Number(height),
        price: Number(price),
        stock: Number(stock),
      },
    });

    res.status(201).json({ message: 'Plakat oprettet', poster });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved oprettelse af plakat' });
  }
};

// Update poster (ADMIN only)
export const updatePoster = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, width, height, price, stock } = req.body;

    const poster = await prisma.poster.update({
      where: { id: Number(id) },
      data: {
        name: name || undefined,
        slug: slug || undefined,
        description: description || undefined,
        image: image || undefined,
        width: width !== undefined ? Number(width) : undefined,
        height: height !== undefined ? Number(height) : undefined,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
      },
    });

    res.json({ message: 'Plakat opdateret', poster });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved opdatering af plakat' });
  }
};

// Delete poster (ADMIN only)
export const deletePoster = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.poster.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Plakat slettet' });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved sletning af plakat' });
  }
};
