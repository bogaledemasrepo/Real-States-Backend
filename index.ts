import express from 'express';
import db from './models';
import { agentTable } from './models/schema';
const app = express();

app.use(express.json());

// Ensure this route exists!
app.post('/agents', async (req, res) => {
  try {
    const newAgent = req.body;
    
    // MAKE SURE THIS LINE EXISTS AND IS AWAITED
    await db.insert(agentTable).values(newAgent); 
    
    res.status(201).json({ message: "Agent created" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to create" });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
