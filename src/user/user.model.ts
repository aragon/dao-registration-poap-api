import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType({ description: 'User' })
export class User {
  @Field(() => Int, { description: 'Unique identifier' })
  id: number;

  @Field(() => String, { description: 'Wallet Address' })
  address: number;
}
