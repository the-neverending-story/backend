require('dotenv').config()

import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('')
export class RootController {
    @Get()
    @HttpCode(403)
    root(): string {
        return 'Invalid Path';
    }
}
