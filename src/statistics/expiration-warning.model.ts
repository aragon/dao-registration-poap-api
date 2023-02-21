import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('ExpirationWarning')
export class ExpirationWarning {
  @Field(() => Int)
  expiringInLessThanDays: number;

  @Field(() => Int)
  claimCodesCount: number;
}
