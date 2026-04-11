import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { RatingsService } from "./ratings.service";
import { Rating } from "./entities/rating.entity";
import { Request } from "express";

@Resolver(() => Rating)
export class RatingsResolver {
  constructor(private readonly ratingsService: RatingsService) {}

  @Mutation(() => Rating, { name: "addRating" })
  addRating(
    @Args("creationId", { type: () => String }) creationId: string,
    @Args("isPositive", { type: () => Boolean }) isPositive: boolean,
    @Context() context: { req: Request },
  ) {
    return this.ratingsService.addRating(
      creationId,
      isPositive,
      context.req.cookies["access_token"],
    );
  }

  @Mutation(() => Rating, { name: "removeRating" })
  removeRating(
    @Args("creation_id", { type: () => String }) creationId: string,
  ) {
    return this.ratingsService.removeRating(creationId);
  }

  @Query(() => Rating, { name: "getRate" })
  getRate(
    @Args("id", { type: () => String }) creationId: string,
    @Context() context: { req: Request },
  ) {
    return this.ratingsService.getRate(
      creationId,
      context.req.cookies["access_token"],
    );
  }
}
