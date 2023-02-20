import { ObjectType } from '@nestjs/graphql';

@ObjectType('ExpirationWarning')
export class ExpirationWarning {
  expiringInLessThanDays: number;
  claimCodesCount: number;
}
