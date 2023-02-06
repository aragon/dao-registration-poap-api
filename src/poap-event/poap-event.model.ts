import { Field, ObjectType, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType({ description: 'A POAP Event' })
export class PoapEvent {
  @Field(() => Int, { description: 'Unique identifier' })
  id: number;

  @Field(() => Int, { description: 'External identifier' })
  externalId: number;

  @Field(() => String, { description: 'Image' })
  image: string;

  @Field(() => GraphQLISODateTime, { description: 'Creation date' })
  createdAt: Date;
}
