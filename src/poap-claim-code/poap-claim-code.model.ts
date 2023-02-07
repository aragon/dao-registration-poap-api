import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType({ description: 'PoapClaimCode' })
export class PoapClaimCode {
  @Field(() => Int, { description: 'Unique identifier' })
  id: number;

  @Field(() => String, { description: 'POAP QR Hash' })
  qrHash: string;

  @Field(() => Boolean, { description: 'Whether or not it has been minted' })
  minted: boolean;

  @Field(() => String, { description: 'DAO Address' })
  daoAddress: string;
}
