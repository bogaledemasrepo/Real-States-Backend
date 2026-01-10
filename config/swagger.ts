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
        // --- AUTH SCHEMAS ---
        SignUpInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'securePassword123',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'CUSTOMER', 'AGENT'],
              default: 'CUSTOMER',
            },
          },
        },
        SignInInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: { type: 'string', example: 'securePassword123' },
          },
        },
        ForgotPasswordInput: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
          },
        },
        ResetPasswordInput: {
          type: 'object',
          required: ['token', 'newPassword'],
          properties: {
            token: {
              type: 'string',
              description: 'The hex token received via email',
            },
            newPassword: { type: 'string', minLength: 6 },
          },
        },

        // --- RESPONSE SCHEMAS ---
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
            isOnline: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid credentials' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'array', items: { type: 'string' } },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  // Path to the API docs (Update these to match your actual file structure)
  apis: ['./routes/*.ts', './controllers/*.ts', './index.ts'],
};

export const specs = swaggerJsdoc(options);
