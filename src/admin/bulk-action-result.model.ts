import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class BulkActionResult {
  @Field(() => Int)
  resolved: number;

  @Field(() => Int)
  unresolved: number;
}
