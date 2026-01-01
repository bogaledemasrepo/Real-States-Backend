# Real-states-backend


## Features
    1. TypeScript support
    2. Express.js web framework
    3. PostgreSQL with Drizzle ORM
    4. JWT authentication

## Prerequisites

    1. Node.js (v24 or higher)
    2. bun
    3. PostgreSQl (local or cloud instance)

## Installation
    Set up environment variables: Edit the .env file with your configuration values.

    1. Clone the repository:
        git clone <repository-url>
        cd real-states-backend

    2. To install dependencies:

    bun install


    3. Development

        Start the development server with hot reload:

        bun run dev
    4. Building

        Build the project for production:

        bun run build

    5. Running

        Start the production server:

        bun start

    6. Testing

        Run tests:

        bun test

        Run tests in watch mode:

        bun run test:watch
## Project structure
    /
    ├── controllers/     # Route controllers
    ├── models/         # Mongoose models
    ├── routes/         # Express routes
    ├── middleware/     # Custom middleware
    ├── config/         # Configuration files
    ├── utils/          # Utility functions
    └── index.ts        # Application entry point

## Available Scripts

    bun run dev - Start development server with hot reload
    bun run build - Build the project for production
    bun start - Start the production server
    bun test - Run tests
    bun run test:watch - Run tests in watch mode
## Environment Variables

Configure the following variables in your .env file:

    PORT - Server port (default: 3000)

    POSTGRESQL_DB_URI - MongoDB connection string

    JWT_SECRET - Secret key for JWT tokens

    JWT_EXPIRES_IN - JWT token expiration time

    SESSION_SECRET - Session secret key

This project was created using `bun init` in bun v1.3.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
