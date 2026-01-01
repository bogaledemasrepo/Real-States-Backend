import { afterAll } from "bun:test";
import db from "./models/index";

afterAll(async () => {
  // Gracefully close the postgres-js connection pool
  // This prevents the test runner from hanging
  // @ts-ignore - accessing the underlying client
  await db.session.client.end();
});