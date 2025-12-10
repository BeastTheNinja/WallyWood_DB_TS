import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'din-hemmelighed';

// Register new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Validering
    if (!firstname || !lastname || !email || !password) {
      res.status(400).json({ error: 'Alle felter skal udfyldes' });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email allerede i brug' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        isActive: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'Bruger oprettet',
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved oprettelse af bruger' });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email og password påkrævet' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Ugyldige login-oplysninger' });
      return;
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Ugyldige login-oplysninger' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login succesfuldt',
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved login' });
  }
};

// Get all users (ADMIN only)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af brugere' });
  }
};

// Get user by ID
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Bruger ikke fundet' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af bruger' });
  }
};

// Update user (ADMIN only for others)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstname, lastname, isActive } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstname: firstname || undefined,
        lastname: lastname || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    res.json({ message: 'Bruger opdateret', user });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved opdatering af bruger' });
  }
};

// Delete user (ADMIN only)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Bruger slettet' });
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved sletning af bruger' });
  }
};

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Bruger ikke fundet' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Fejl ved hentning af profil' });
  }
};