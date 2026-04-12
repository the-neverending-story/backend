import { Resolver, Query, Mutation, Args, Context, Int } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CreationsService } from "./creations.service";
import { Creation } from "./entities/creation.entity";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { JwtPayload } from "../auth/jwt.strategy";
import { Request } from "express";

@Resolver(() => Creation)
export class CreationsResolver {
  constructor(private readonly creationsService: CreationsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Creation, { name: "createCreation" })
  createCreation(
    @Args("name", { type: () => String }) name: string,
    @Args("category", { type: () => String }) category: string,
    @Args("content", { type: () => String }) content: string,
    @Context() context: { req: Request & { user: JwtPayload } },
  ) {
    return this.creationsService.create(
      name,
      category,
      content,
      context.req.user,
    );
  }

  @Query(() => [Creation], { name: "getCreations" })
  getPageOfCreations(
    @Args("page", { type: () => Int }) page: number,
    @Args("category", { type: () => String, nullable: true }) category: string,
  ) {
    return this.creationsService.getPageOfCreations(page, category);
  }

  @Query(() => Creation, { name: "getCreation" })
  getCreation(@Args("id", { type: () => String }) id: string) {
    return this.creationsService.getCreationById(id);
  }
}
