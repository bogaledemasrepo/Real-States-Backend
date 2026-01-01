import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';

// Ensure the environment variable is defined
if (!process.env.REAL_STATES_DATABASE_URL) {
  throw new Error('REAL_STATES_DATABASE_URL is not set in .env');
}
if (!process.env.REAL_STATES_DATABASE_LOCAL_URL) {
  throw new Error('REAL_STATES_DATABASE_LOCAL_URL is not set in .env');
}

// Initialize postgres-js client
const client = postgres(
  process.env.NODE_ENV == 'development'
    ? process.env.REAL_STATES_DATABASE_LOCAL_URL!
    : process.env.REAL_STATES_DATABASE_URL!,
);
// Initialize Drizzle ORM with schema and logging
export default drizzle(client, { schema, logger: true });
