import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';

// Use the database connection URL directly
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necessary for Render and other cloud databases
    },
    decimalNumbers: true,
  },
  logging: false // Set to console.log to see SQL queries
});

// Initialize models
const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);

// Define relationships
User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser'});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    // Don't crash the server, but log the error
  });

export { sequelize, User, Ticket };