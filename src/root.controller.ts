// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports
require("dotenv").config();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
require("node-pg-migrate").runner({
  dbClient: {
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    ssl: {
      rejectUnauthorized: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
      ca: require("fs").readFileSync("./us-west-2-bundle.pem").toString(),
    },
  },
  dir: "migrations",
  direction: "up",
  migrationsTable: "pgmigrations",
  count: Infinity,
});
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("./cron");

import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("")
export class RootController {
  @Get()
  @HttpCode(403)
  root(): string {
    return "Invalid Path";
  }

  @Get("health")
  @HttpCode(200)
  health(): string {
    return "All good";
  }
}
