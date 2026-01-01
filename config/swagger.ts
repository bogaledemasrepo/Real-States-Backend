import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real Estate Backend API',
      version: '1.0.0',
      description: 'API Documentation for the Real Estate Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Define your common Error schema here so your $refs work
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message here' },
          },
        },
        User: {
           type: 'object',
           properties: {
             id: { type: 'string' },
             email: { type: 'string' },
             name: { type: 'string' }
           }
        }
      },
    },
  },
  // Path to the API docs (where your @swagger comments are)
  apis: ['./routes/*.ts', './index.ts'], 
};

export const specs = swaggerJsdoc(options);