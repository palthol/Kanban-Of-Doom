# Krazy Kanban Board

A full-stack Kanban board application that allows users to create, manage, and track tickets in different status columns. Built with React, TypeScript, and Express.js.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Screenshots](#screenshots)
- [Sorting and Filtering](#sorting-and-filtering)
- [License](#license)

## Features

- **User Authentication**

  - Register new users with unique usernames
  - Secure login with JWT token authentication
  - Password encryption with bcrypt

- **Ticket Management**

  - Create new tickets with title, description, and status
  - Edit existing tickets
  - Delete tickets
  - View all tickets in a Kanban board layout

- **Kanban Board**

  - Three status columns: Todo, In Progress, Done
  - Visual indication of ticket status through color-coded columns
  - Drag-and-drop functionality (coming soon)

- **Ticket Organization**
  - Sort tickets by various criteria
  - Filter tickets by different properties
  - Assign tickets to users

## Technologies Used

### Frontend

- React 18 with TypeScript
- React Router for navigation
- JWT for authentication
- Vite for build tooling and development server
- Custom CSS for styling

### Backend

- Express.js with TypeScript
- Sequelize ORM for database operations
- PostgreSQL database
- JWT for token-based authentication
- bcrypt for password hashing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Setup

1. Clone the repository

```bash
git clone <repository-url>
cd krazy-kanban-board
```
