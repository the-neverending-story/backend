import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field(() => String, { description: "uuid" })
  id: string;

  @Field(() => String, { description: "Username" })
  username: string;

  @Field(() => String, { description: "Timestamp of creation" })
  created_at: string;

  @Field(() => String, {
    description: "Role of the user (e.g. admin, moderator, default)",
  })
  role: string;
}
