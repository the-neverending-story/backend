// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports
require("dotenv").config();

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
