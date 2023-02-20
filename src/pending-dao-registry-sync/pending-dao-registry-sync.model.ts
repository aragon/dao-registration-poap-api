import { ObjectType } from '@nestjs/graphql';

@ObjectType('PendingDAORegistrySync')
export class PendingDAORegistrySync {
  daoAddress: string;
  creatorAddress: string;
  errorLocation: string;
}
