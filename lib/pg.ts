import { Pool } from "pg";

declare global {
  // prevent creating new pool on every hot reload in dev
  var _pgPool: Pool | undefined;
}

// create postgress connection pool and read for DB URL
export const pg =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pg;
}
