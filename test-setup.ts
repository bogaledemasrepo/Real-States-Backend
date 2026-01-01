import { afterAll, beforeAll } from 'bun:test';
import db from './models/index';
import { sql } from 'drizzle-orm';



beforeAll(async () => {
  // Option A: Just empty the tables (Faster)
  // We use TRUNCATE with CASCADE to handle foreign key dependencies
  await db.execute(sql`TRUNCATE TABLE agents, properties, reviews RESTART IDENTITY CASCADE`);
  console.log("Cleaned database for testing...");
});

afterAll(async () => {
  // Gracefully close the postgres-js connection pool
  // This prevents the test runner from hanging
  // @ts-expect-error - accessing the underlying client for postgres-js cleanup
  await db.session.client.end();
});