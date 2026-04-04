// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports
require("dotenv").config();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
require("child_process").exec("npm run migrate up", (err, stdout, stderr) => {
  console.log("migration successful");
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
});

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
