import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PoapClaimCodeStatus } from '@prisma/client';

@ObjectType({ description: 'PoapClaimCode' })
export class PoapClaimCode {
  @Field(() => Int, { description: 'Unique identifier' })
  id: number;

  @Field(() => String, { description: 'POAP QR Hash' })
  qrHash: string;

  @Field(() => String, { description: 'POAP Claim Code' })
  status: PoapClaimCodeStatus;

  @Field(() => String, { description: 'DAO Address' })
  daoAddress: string;

  eventId: number;

  @Field(() => Int, { description: 'Token ID', nullable: true })
  tokenId?: number;
}
