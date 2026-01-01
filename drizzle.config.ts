import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Manually load .env from the root directory
dotenv.config();

// Debugging: This should now show your URLs
console.log(
  'Local DB URL:',
  process.env.NODE_ENV == 'production'
    ? process.env.REAL_STATES_DATABASE_URL!
    : process.env.REAL_STATES_DATABASE_LOCAL_URL!,
);

export default defineConfig({
  schema: './models/schema.ts',
  out: './models/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // We use a simple fallback logic here
    url:
      process.env.NODE_ENV == 'production'
        ? process.env.REAL_STATES_DATABASE_URL!
        : process.env.REAL_STATES_DATABASE_LOCAL_URL!,
  },
});
