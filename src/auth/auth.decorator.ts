import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(UseGuards(AuthGuard));
}
