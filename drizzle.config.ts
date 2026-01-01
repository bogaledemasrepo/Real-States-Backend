import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
if (!process.env.REAL_STATES_DATABASE_URL) {
  throw new Error('REAL_STATES_DATABASE_URL is not set in .env');
}
if (!process.env.REAL_STATES_DATABASE_LOCAL_URL) {
  throw new Error('REAL_STATES_DATABASE_LOCAL_URL is not set in .env');
}

export default defineConfig({
  schema: './models/schema.ts',
  out: './models/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.NODE_ENV == 'development'
        ? process.env.REAL_STATES_DATABASE_LOCAL_URL!
        : process.env.REAL_STATES_DATABASE_URL!,
  },
});
