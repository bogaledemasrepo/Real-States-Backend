import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './docs/swagger';
import authRoutes from './routes/auth.route';
import propertyRoutes from './routes/property.route';
import userRouter from './routes/users.route';
import { protect } from './middleware/auth.middleware';
const app = express();

app.use(express.json());

// Serve Swagger UI at /api-docs
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', protect, userRouter);
app.use('/api/v1/property', protect, propertyRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
