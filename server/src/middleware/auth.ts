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
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
   
  console.log('Auth middleware: Token received:', !!token);
   
  if (!token) {
    console.log('Auth middleware: No token provided');
    return res.status(401).json({ message: 'Authentication required' });
  }
   
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET_KEY ?? 'awesome_super_secure_secret_here'
    ) as UserPayload;
     
    console.log('Auth middleware: Valid token for user:', decoded.username);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware: Invalid token', error);
    // Add this line to return a response for the error case:
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};