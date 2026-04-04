// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports
require("dotenv").config();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
require("child_process").exec(
  `DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_DATABASE${process.env.NODE_ENV === "production" ? "?sslmode=verify-full&sslrootcert=./us-west-2-bundle.pem" : null} npm run migrate up`,
  (err, stdout, stderr) => {
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
