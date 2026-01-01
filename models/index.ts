import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use a fallback to prevent the 'throw' from crashing the test runner
const dbUrl =
  process.env.NODE_ENV == 'production'
    ? process.env.REAL_STATES_DATABASE_URL!
    : process.env.REAL_STATES_DATABASE_LOCAL_URL!;

// Only throw if WE ARE NOT in a test environment and the URL is missing
if (!dbUrl && process.env.NODE_ENV !== 'test') {
  throw new Error('Database connection string is missing in .env');
}

// Initialize client with the URL or a local default for tests
const client = postgres(dbUrl);

const db = drizzle(client, { schema, logger: true });
export default db;
