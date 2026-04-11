import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Rating {
  @Field(() => String, { description: "id" })
  id!: string;

  @Field(() => String, { description: "true if +1, false if -1, blank if no vote" })
  is_positive: string = "";
}
