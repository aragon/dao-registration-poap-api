import { Field, ObjectType } from '@nestjs/graphql';
import { PendingDAORegistrySync } from '../pending-dao-registry-sync/pending-dao-registry-sync.model';
import { ExpirationWarning } from './expiration-warning.model';

@ObjectType('Statistics')
export class Statistics {
  @Field(() => Number, { description: 'Number of poap codes available' })
  availableClaimCodesCount: number;

  @Field(() => Number, { description: 'Number of poap codes assigned' })
  assignedClaimCodesCount: number;

  @Field(() => Number, { description: 'Number of poap codes minted' })
  mintedClaimCodesCount: number;

  @Field(() => ExpirationWarning, { description: 'Expiration Warning Details' })
  expirationWarning: ExpirationWarning;

  @Field(() => [PendingDAORegistrySync], {
    description: 'Pending DAO Registry Syncs',
  })
  pendingSyncs: PendingDAORegistrySync[];
}
