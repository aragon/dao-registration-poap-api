import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DaoRegistryEvent {
  @Field(() => String)
  dao: string;

  @Field(() => String)
  creator: string;

  @Field(() => String)
  subdomain: string;
}
