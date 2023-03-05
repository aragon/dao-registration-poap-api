import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DaoRegistryFilterInput {
  @Field(() => String, { nullable: true })
  dao?: string | null;

  @Field(() => String, { nullable: true })
  creator?: string | null;
}
