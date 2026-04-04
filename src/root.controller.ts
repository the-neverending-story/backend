// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports
require("dotenv").config();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
require("child_process").exec(
  `DATABASE_URL=postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}${process.env.NODE_ENV === "production" ? "?sslmode=verify-full&sslrootcert=./us-west-2-bundle.pem" : ''} npm run migrate up`,
  (err, stdout, stderr) => {
    console.log(`string: DATABASE_URL=postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}${process.env.NODE_ENV === "production" ? "?sslmode=verify-full&sslrootcert=./us-west-2-bundle.pem" : ''}`)
    if (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(err.message);
      return;
    }
    if (stderr) {
      console.log(stderr);
      return;
    }
    console.log(stdout);
  },
);

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
