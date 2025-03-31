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

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header using optional chaining
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
   
  console.log('Auth middleware: Token received:', !!token);
   
  if (!token) {
    console.log('Auth middleware: No token provided');
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
   
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET_KEY ?? 'awesome_super_secure_secret_here'
    ) as UserPayload;
     
    console.log('Auth middleware: Valid token for user:', decoded.username);
    req.user = decoded;
    next();
    return; // Explicit return for TypeScript
  } catch (error) {
    console.error('Auth middleware: Invalid token', error);
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};