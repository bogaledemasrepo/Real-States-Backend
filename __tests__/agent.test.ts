import { describe, expect, it } from 'bun:test';
import request from 'supertest';
import app from '../app';

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
  });
});
