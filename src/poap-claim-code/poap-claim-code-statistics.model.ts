import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType({ description: 'PoapClaimCodeStatistics' })
export class PoapClaimCodeStatistics {
  @Field(() => Int, { description: 'Total number of claim codes' })
  totalClaimCodes: number;

  @Field(() => Int, { description: 'Total number of claim codes assigned' })
  totalClaimCodesAssigned: number;

  @Field(() => Int, { description: 'Total number of claim codes minted' })
  totalClaimCodesMinted: number;
}
