import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '2h' }
    );
    
    return res.json({ token, user: { username: user.username, id: user.id } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;