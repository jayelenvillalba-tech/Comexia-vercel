import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/shared/schema-sqlite.ts",
  out: "./database/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.SQLITE_DB_PATH || "./comexia.db",
  },
});
