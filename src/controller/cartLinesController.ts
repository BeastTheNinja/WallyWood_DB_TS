import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Get all cartlines
export const getAllCartlines = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cartlines = await prisma.cartline.findMany({
      include: {
        user: true,
        poster: true,
      },
    });
    res.json(cartlines);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af kurve' });
  }
};

// Get cartlines by user ID
export const getCartlinesByUserId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const cartlines = await prisma.cartline.findMany({
      where: { userId: Number(userId) },
      include: {
        poster: true,
      },
    });

    res.json(cartlines);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af kurve' });
  }
};

// Get cartline by ID
export const getCartlineById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const cartline = await prisma.cartline.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        poster: true,
      },
    });

    if (!cartline) {
      res.status(404).json({ error: 'Kurvelinje ikke fundet' });
      return;
    }

    res.json(cartline);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af kurvelinje' });
  }
};

// Create cartline (USER - add to own cart)
export const createCartline = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, posterId, quantity } = req.body;

    if (!userId || !posterId || !quantity) {
      res.status(400).json({ error: 'userId, posterId og quantity er påkrævet' });
      return;
    }

    // Check if item already in cart
    const existing = await prisma.cartline.findUnique({
      where: { userId_posterId: { userId: Number(userId), posterId: Number(posterId) } },
    });

    if (existing) {
      // Update quantity
      const updated = await prisma.cartline.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Number(quantity) },
      });
      res.status(200).json({ message: 'Kurvelinje opdateret', cartline: updated });
      return;
    }

    const cartline = await prisma.cartline.create({
      data: {
        userId: Number(userId),
        posterId: Number(posterId),
        quantity: Number(quantity),
      },
    });

    res.status(201).json({ message: 'Til kurven tilføjet', cartline });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved tilføjelse til kurv' });
  }
};

// Update cartline quantity
export const updateCartline = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity <= 0) {
      res.status(400).json({ error: 'Quantity skal være større end 0' });
      return;
    }

    const cartline = await prisma.cartline.update({
      where: { id: Number(id) },
      data: { quantity: Number(quantity) },
    });

    res.json({ message: 'Kurvelinje opdateret', cartline });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved opdatering af kurvelinje' });
  }
};

// Delete cartline (remove from cart)
export const deleteCartline = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.cartline.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Fjernet fra kurv' });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved fjernelse fra kurv' });
  }
};

// Clear entire cart for a user
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    await prisma.cartline.deleteMany({
      where: { userId: Number(userId) },
    });

    res.json({ message: 'Kurv tømt' });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved tømning af kurv' });
  }
};
