import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set DATABASE_URL."
  );
}

export const client = postgres(connectionString, {
  prepare: false,
  ssl: "prefer",
  max: 10,
});

export const db = drizzle(client);
