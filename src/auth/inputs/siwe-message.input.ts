import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SiweMessage {
  @Field(() => String, { description: 'Domain' })
  domain: string;

  @Field(() => String, { description: 'Address' })
  address: string;

  @Field(() => String, { description: 'Statement' })
  statement: string;

  @Field(() => String, { description: 'URI' })
  uri: string;

  @Field(() => String, { description: 'Version' })
  version: string;

  @Field(() => Int, { description: 'Chain ID' })
  chainId: number;

  @Field(() => String, { description: 'Nonce' })
  nonce: string;

  @Field(() => String, { description: 'Issued At' })
  issuedAt: string;
}
