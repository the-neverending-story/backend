import { Module } from "@nestjs/common";
import { CreationsService } from "./creations.service";
import { CreationsResolver } from "./creations.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [CreationsResolver, CreationsService],
})
export class CreationsModule {}
