import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType({ description: 'PoapClaimCode' })
export class PoapClaimCode {
  @Field(() => Int, { description: 'Unique identifier' })
  id: number;

  @Field(() => String, { description: 'POAP QR Hash' })
  qrHash: string;

  @Field(() => Boolean, { description: 'Whether or not it has been assigned' })
  isAssigned: boolean;

  @Field(() => Boolean, { description: 'Whether or not it has been claimed' })
  isMinted: boolean;

  @Field(() => String, { description: 'DAO Address' })
  daoAddress: string;

  eventId: number;
}
