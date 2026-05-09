import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field(() => String, { description: "uuid" })
  id!: string;

  @Field(() => String, { description: "Username" })
  username!: string;

  @Field(() => String, { description: "unix epoch creation date" })
  created_at!: string;

  @Field(() => String, {
    description: "Role of the user (e.g. admin, moderator, default)",
  })
  role!: string;
}
