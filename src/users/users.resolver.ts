import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { Request, Response } from "express";
import { JwtPayload } from "src/auth/jwt.strategy";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/gql-auth.guard";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => User, { name: "getUser" })
  getUser(@Args("username", { type: () => String }) username: string) {
    return this.usersService.getUser(username);
  }

  @Mutation(() => User, { name: "register" })
  register(
    @Args("email", { type: () => String }) email: string,
    @Args("username", { type: () => String }) username: string,
    @Args("password", { type: () => String }) password: string,
    @Context() context: { res: Response },
  ) {
    return this.usersService.register(email, username, password, context.res);
  }

  @Mutation(() => User, { name: "login" })
  login(
    @Args("username") username: string,
    @Args("password") password: string,
    @Context() context: { res: Response },
  ) {
    const result = this.usersService.login(username, password, context.res);
    return result;
  }
  
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { name: "updateUser" })
  updateUser(
    @Args("bio", { type: () => String, nullable: true } ) bio: string,
    @Context() context: { req: Request & { user: JwtPayload } },
  ) {
    const result = this.usersService.updateUser({ bio }, context.req.user);
    return result;
  }
}
