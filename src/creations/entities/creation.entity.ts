import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Creation {
  @Field(() => String, { description: "creation id" })
  id!: string;

  @Field(() => String, { description: "name of the creation" })
  name!: string;

  @Field(() => String, { description: "authors username" })
  author_username!: string;

  @Field(() => String, { description: "creation date" })
  created_at!: string;

  @Field(() => String, { description: "category of the creation" })
  category!: string;

  @Field(() => String, { description: "content of the creation" })
  content!: string;

  @Field(() => Int, { description: "creation score" })
  rating: number = 0;
}
