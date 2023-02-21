import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class ReassignPendingSyncResult {
  @Field(() => Int)
  resolved: number;

  @Field(() => Int)
  unresolved: number;
}
