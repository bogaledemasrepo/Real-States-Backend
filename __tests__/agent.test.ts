import { describe, expect, it } from 'bun:test';
import request from 'supertest';
import app from '../index';
import db from '../models/index';
import { agentTable } from '../models/schema';
import { eq } from 'drizzle-orm';

describe('Agent API Endpoints', () => {
  it('should create a new agent in the database', async () => {
    const newAgent = {
      name: 'Bogale',
      email: 'bogidemas@gmail.com',
      phone: '+251923872187',
      type: 'owner',
    };

    const response = await request(app).post('/agents').send(newAgent);

    expect(response.status).toBe(201);

    // Verify it exists in the DB using Drizzle
    const dbAgent = await db.query.agentTable.findFirst({
      where: eq(agentTable.email, 'bogidemas@gmail.com'),
    });

    expect(dbAgent).toBeDefined();
    expect(dbAgent?.name).toBe('Bogale');
  });
});
