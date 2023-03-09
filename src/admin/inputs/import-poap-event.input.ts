import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ description: 'POAP Event to create' })
export class ImportPoapEventInput {
  @Field(() => Int, { description: 'External identifier', nullable: false })
  externalId: number;

  @Field(() => String, { description: 'Secret Code', nullable: false })
  secretCode: string;
}
