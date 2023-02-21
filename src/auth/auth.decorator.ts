import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export function Auth({ isAdmin }: { isAdmin?: boolean } = { isAdmin: false }) {
  return applyDecorators(UseGuards(new AuthGuard(isAdmin)));
}
