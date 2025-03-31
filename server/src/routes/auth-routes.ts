import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Debug input
    console.log('Login attempt:', { username, passwordProvided: !!password });
    
    // Find user by username
    const user = await User.findOne({ where: { username } });
    
    // If no user found, return unauthorized
    if (!user) {
      console.log('Login failed: User not found', { username });
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    console.log('User found:', { 
      username: user.username, 
      passwordStored: !!user.password,
      passwordLength: user.password?.length
    });
    
    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    
    console.log('Password check result:', { 
      username,
      validPassword,
      inputPasswordLength: password.length,
      storedPasswordLength: user.password.length
    });
    
    if (!validPassword) {
      console.log('Login failed: Invalid password', { username });
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET_KEY ?? 'awesome_super_secure_secret_here',
      { expiresIn: '2h' }
    );
    
    // Send success response with token
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// Add register function
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    // Hash password with consistent salt rounds
    const saltRounds = 10;
    console.log('Hashing password:', { username, passwordLength: password.length });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully:', { 
      username, 
      hashedPasswordLength: hashedPassword.length 
    });
    
    // Create user
    const newUser = await User.create({
      username,
      password
    });
    
    console.log('User created successfully:', { 
      id: newUser.id, 
      username: newUser.username,
      passwordStored: !!newUser.password,
      passwordLength: newUser.password?.length
    });
    
    // Return success (don't return password)
    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

// POST /register - Register a new user
router.post('/register', register);
export default router;