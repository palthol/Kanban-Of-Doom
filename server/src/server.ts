// Control whether to reset the database on server start
const forceDatabaseRefresh = false; // Set to true to reset the database
// This is useful for development but should be false in production

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Import dependencies
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT ?? 3001;

// Configure CORS 
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server default
    'http://localhost:3001',  // Alternative dev port
    'http://localhost:5174',  // Vite preview default
    'http://localhost:3000'   // React default port
  ],
  credentials: true  // Allow cookies for authentication
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves static files from the client's dist folder
app.use(express.static('../client/dist'));

// API routes
app.use(routes);

// Error handling for 404s
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to database and start server
console.log('Connecting to database...');
console.log(forceDatabaseRefresh ? 'WARNING: Database will be reset!' : 'Database will maintain existing data');

sequelize.sync({ force: forceDatabaseRefresh })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to the database:', err);
  });