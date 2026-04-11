import { Resolver, Query, Mutation, Args, Context, Int } from "@nestjs/graphql";
import { CreationsService } from "./creations.service";
import { Creation } from "./entities/creation.entity";
import { Request } from "express";

@Resolver(() => Creation)
export class CreationsResolver {
  constructor(private readonly creationsService: CreationsService) {}

  @Mutation(() => Creation, { name: "createCreation" })
  createCreation(
    @Args("name", { type: () => String }) name: string,
    @Args("category", { type: () => String }) category: string,
    @Args("content", { type: () => String }) content: string,
    @Context() context: { req: Request },
  ) {
    return this.creationsService.create(name, category, content, context.req);
  }

  @Query(() => [Creation], { name: "getCreations" })
  getPageOfCreations(@Args("page", { type: () => Int }) page: number) {
    return this.creationsService.getPageOfCreations(page);
  }

  @Query(() => Creation, { name: "getCreation" })
  getCreation(@Args("id", { type: () => String }) id: string) {
    return this.creationsService.getCreationById(id);
  }
}
