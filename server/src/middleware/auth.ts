import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a unified user type that works across the application
interface UserPayload {
  username: string;
  id: number;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the auth header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    ) as UserPayload;
    
    // Add user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};