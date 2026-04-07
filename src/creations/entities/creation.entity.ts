import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class Creation {
  @Field(() => String, { description: "id" })
  id!: string;
}
