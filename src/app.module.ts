import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { RootController } from "./root.controller";
import { UsersModule } from "./users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { CreationsModule } from "./creations/creations.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: process.cwd() + "/src/schema.gql",
      sortSchema: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: ({ req, res }) => ({ req, res }),
      playground: false,
    }),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    CreationsModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
