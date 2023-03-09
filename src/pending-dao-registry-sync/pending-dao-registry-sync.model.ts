import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('PendingDAORegistrySync')
export class PendingDAORegistrySync {
  @Field(() => String)
  daoAddress: string;

  @Field(() => String)
  creatorAddress: string;

  @Field(() => String)
  errorLocation: string;
}
