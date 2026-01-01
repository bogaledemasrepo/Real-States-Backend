import { describe, expect, it } from 'bun:test';
import request from 'supertest';
import app from '../index';

describe('Backend API', () => {
  it('should return 200 on health check', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
