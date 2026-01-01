import express from 'express';
import db from './models';
import { agentTable } from './models/schema';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import authRoutes from './routes/auth.route';
const app = express();

app.use(express.json());

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/v1/auth', authRoutes);

// Ensure this route exists!
app.post('/agents', async (req, res) => {
  try {
    const newAgent = req.body;

    // MAKE SURE THIS LINE EXISTS AND IS AWAITED
    await db.insert(agentTable).values(newAgent);

    res.status(201).json({ message: 'Agent created' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;


// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
//   console.log('Docs available on http://localhost:3000/api-docs');
// });